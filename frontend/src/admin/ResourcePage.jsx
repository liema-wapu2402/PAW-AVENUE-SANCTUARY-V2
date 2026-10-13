import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { api } from "../api";
import { RESOURCES } from "./resources";
import ResourceForm from "./ResourceForm";
import Icon from "../components/Icons";
import Paw from "../components/Paw";

const PAGE_SIZE = 10;

/* small inline line icons for the action buttons */
const svgProps = {
  viewBox: "0 0 24 24",
  width: 16,
  height: 16,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};
const IconEdit = () => (
  <svg {...svgProps}>
    <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" />
    <path d="M13.500 6.500l4 4" />
  </svg>
);
const IconEye = () => (
  <svg {...svgProps}>
    <path d="M2 12s3.600-7 10-7 10 7 10 7-3.600 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconTrash = () => (
  <svg {...svgProps}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
  </svg>
);
const IconSearch = () => (
  <svg {...svgProps}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.500-3.500" />
  </svg>
);

function Cell({ value }) {
  if (value && typeof value === "object") {
    if (value.type === "img")
      return <img className="thumb" src={value.src} alt="" loading="lazy" />;
    if (value.type === "badge")
      return (
        <span className={`badge badge-${value.value}`}>{value.value}</span>
      );
  }
  return value ?? "—";
}

/** Plain-text version of a cell, used by the search box. */
const cellText = (v) =>
  v && typeof v === "object"
    ? v.type === "badge"
      ? v.value
      : ""
    : String(v ?? "");

/**
 * Keyed by resource so every sidebar link gets a fresh page (fresh state).
 * Without the key, the previous module's rows were rendered with the new module's columns,
 * which crashed the page until you refreshed.
 */
export default function ResourcePage() {
  const { resource } = useParams();
  return <ResourceView key={resource} resource={resource} />;
}

function ResourceView({ resource }) {
  const def = RESOURCES[resource];
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // row | {} (new) | null
  const [viewing, setViewing] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const load = useCallback(() => {
    setRows(null);
    setError("");
    api(`/admin/${resource}`)
      .then((data) => alive.current && setRows(Array.isArray(data) ? data : []))
      .catch((e) => alive.current && setError(e.message));
  }, [resource]);

  useEffect(() => {
    if (def) load();
  }, [def, load]);

  // reset to the first page whenever the visible set changes
  useEffect(() => setPage(1), [query, filter]);

  const filtered = useMemo(() => {
    if (!rows || !def) return [];
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (
        filter !== "all" &&
        def.statusField &&
        row[def.statusField] !== filter
      )
        return false;
      if (!q) return true;
      return def.columns.some((c) =>
        cellText(c.render ? c.render(row) : row[c.key])
          .toLowerCase()
          .includes(q)
      );
    });
  }, [rows, query, filter, def]);

  if (!def) return <Navigate to="/admin" replace />;

  const patch = async (row, body) => {
    try {
      const updated = await api(`/admin/${resource}/${row.id}`, {
        method: "PUT",
        body,
      });
      setRows((rs) => rs.map((r) => (r.id === row.id ? updated : r)));
      if (resource === "applications" && body.status === "approved") load(); // pet became adopted
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (row) => {
    if (!window.confirm("Delete this entry? This cannot be undone.")) return;
    try {
      await api(`/admin/${resource}/${row.id}`, { method: "DELETE" });
      setRows((rs) => rs.filter((r) => r.id !== row.id));
    } catch (e) {
      setError(e.message);
    }
  };

  const inbox = def.kind === "inbox";
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice(
    (current - 1) * PAGE_SIZE,
    current * PAGE_SIZE
  );
  const unread =
    def.readField && rows ? rows.filter((r) => !r[def.readField]).length : 0;
  const countOf = (s) =>
    (rows || []).filter((r) => r[def.statusField] === s).length;
  const colSpan =
    def.columns.length +
    (def.statusField ? 1 : 0) +
    (def.readField ? 1 : 0) +
    1;

  return (
    <div className="res">
      <div className="admin-head">
        <div>
          <h1 className="admin-title">{def.title}</h1>
          <p className="res-sub">
            {rows ? (
              <>
                {rows.length} {rows.length === 1 ? "entry" : "entries"}
                {unread > 0 && (
                  <>
                    {" "}
                    · <b>{unread} unread</b>
                  </>
                )}
              </>
            ) : (
              "Loading…"
            )}
          </p>
        </div>
        {!inbox && (
          <button className="btn btn-primary" onClick={() => setEditing({})}>
            <Icon name="plus" /> Add new
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* toolbar: search + status filter chips */}
      {(!rows || rows.length > 0) && (
        <div className="res-toolbar">
          <label className="res-search">
            <IconSearch />
            <input
              type="search"
              placeholder={`Search ${def.label.toLowerCase()}…`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={!rows}
              aria-label="Search"
            />
          </label>
          {def.statusField && (
            <div
              className="res-chips"
              role="tablist"
              aria-label="Filter by status"
            >
              <button
                className={filter === "all" ? "on" : ""}
                onClick={() => setFilter("all")}
              >
                All <i>{rows ? rows.length : 0}</i>
              </button>
              {def.statuses.map((s) => (
                <button
                  key={s}
                  className={filter === s ? "on" : ""}
                  onClick={() => setFilter(s)}
                >
                  {s} <i>{countOf(s)}</i>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* loading skeleton */}
      {!rows && !error && (
        <div className="table-wrap" aria-busy="true">
          {[0, 1, 2, 3, 4].map((n) => (
            <div className="res-skel" key={n}>
              <span className="sk sk-av" />
              <span className="sk sk-line" />
              <span className="sk sk-pill" />
            </div>
          ))}
        </div>
      )}

      {rows && rows.length === 0 && (
        <div className="panel res-empty">
          <Paw className="empty-paw" />
          <h3>Nothing here yet</h3>
          <p className="muted">
            {inbox
              ? "New submissions from the website will appear here."
              : "Add your first entry to get started."}
          </p>
          {!inbox && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setEditing({})}
            >
              <Icon name="plus" /> Add new
            </button>
          )}
        </div>
      )}

      {rows && rows.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                {def.columns.map((c) => (
                  <th key={c.label}>{c.label}</th>
                ))}
                {def.statusField && <th>Status</th>}
                {def.readField && <th>Read</th>}
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr className="no-match">
                  <td colSpan={colSpan}>No results match your search.</td>
                </tr>
              )}
              {visible.map((row, i) => (
                <tr
                  key={row.id}
                  style={{ "--i": i }}
                  className={
                    def.readField && !row[def.readField] ? "unread" : ""
                  }
                >
                  {def.columns.map((c, ci) => (
                    <td
                      key={c.label}
                      data-label={c.label}
                      className={ci === 0 ? "cell-main" : ""}
                    >
                      <Cell value={c.render ? c.render(row) : row[c.key]} />
                    </td>
                  ))}
                  {def.statusField && (
                    <td data-label="Status">
                      <select
                        className={`status-select badge-${row[def.statusField]}`}
                        value={row[def.statusField]}
                        onChange={(e) =>
                          patch(row, { [def.statusField]: e.target.value })
                        }
                        aria-label="Change status"
                      >
                        {def.statuses.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  )}
                  {def.readField && (
                    <td data-label="Read">
                      <input
                        type="checkbox"
                        className="read-check"
                        checked={!!row[def.readField]}
                        onChange={(e) =>
                          patch(row, { [def.readField]: e.target.checked })
                        }
                        aria-label="Mark as read"
                      />
                    </td>
                  )}
                  <td className="actions" data-label="Actions">
                    {inbox ? (
                      <button
                        className="act act-view"
                        onClick={() => {
                          setViewing(row);
                          if (def.readField && !row[def.readField])
                            patch(row, { [def.readField]: true });
                        }}
                      >
                        <IconEye /> <span>View</span>
                      </button>
                    ) : (
                      <button
                        className="act act-edit"
                        title="Edit"
                        onClick={() => setEditing(row)}
                      >
                        <IconEdit /> <span>Edit</span>
                      </button>
                    )}
                    <button
                      className="act act-del"
                      title="Delete"
                      onClick={() => remove(row)}
                    >
                      <IconTrash /> <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length > PAGE_SIZE && (
            <div className="pager">
              <span>
                Showing {(current - 1) * PAGE_SIZE + 1}–
                {Math.min(current * PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length}
              </span>
              <div>
                <button
                  onClick={() => setPage(current - 1)}
                  disabled={current === 1}
                >
                  ← Prev
                </button>
                <b>
                  {current} / {pages}
                </b>
                <button
                  onClick={() => setPage(current + 1)}
                  disabled={current === pages}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {editing && (
        <ResourceForm
          resource={resource}
          def={def}
          row={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}

      {viewing && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => e.target === e.currentTarget && setViewing(null)}
        >
          <div className="modal">
            <button
              className="modal-close"
              onClick={() => setViewing(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h2>{def.title}</h2>
            <dl className="details">
              {def.details(viewing).map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
