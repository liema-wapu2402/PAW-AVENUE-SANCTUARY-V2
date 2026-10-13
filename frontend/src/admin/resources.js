import { img } from "../api";

const date = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";
const thumb = (row) => row.image && { type: "img", src: img(row.image) };

/**
 * Describes every manageable resource: the sidebar entry, the table columns and the form fields.
 * kind: 'content' (full CRUD) | 'inbox' (visitor submissions: change status / delete)
 */
export const RESOURCES = {
  pets: {
    label: "Pets",
    icon: "🐾",
    kind: "content",
    title: "Pets for adoption",
    columns: [
      { label: "Photo", render: thumb },
      { label: "Name", key: "name" },
      {
        label: "Species",
        render: (r) => (r.species === "dog" ? "🐶 Dog" : "🐱 Cat"),
      },
      { label: "Breed", key: "breed" },
      { label: "Status", render: (r) => ({ type: "badge", value: r.status }) },
      { label: "On home page", render: (r) => (r.is_featured ? "Yes" : "No") },
    ],
    fields: [
      { name: "name", label: "Name", required: true },
      {
        name: "species",
        label: "Species",
        type: "select",
        options: ["dog", "cat"],
        required: true,
        default: "dog",
      },
      { name: "breed", label: "Breed" },
      { name: "age", label: "Age (e.g. 2 years)" },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        options: ["", "male", "female"],
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["available", "pending", "adopted"],
        required: true,
        default: "available",
      },
      {
        name: "is_featured",
        label: "Show on home page",
        type: "checkbox",
        default: true,
      },
      { name: "image", label: "Photo", type: "image" },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        wide: true,
      },
    ],
  },
  vets: {
    label: "Veterinarians",
    icon: "🩺",
    kind: "content",
    title: "Veterinarians",
    columns: [
      { label: "Photo", render: thumb },
      { label: "Name", key: "name" },
      { label: "Title", key: "title" },
      { label: "Order", key: "sort_order" },
    ],
    fields: [
      { name: "name", label: "Name", required: true },
      {
        name: "title",
        label: "Title",
        required: true,
        default: "Licensed Veterinarian",
      },
      { name: "sort_order", label: "Order", type: "number", default: 0 },
      { name: "image", label: "Photo", type: "image" },
      { name: "bio", label: "Bio", type: "textarea", wide: true },
    ],
  },
  services: {
    label: "Services",
    icon: "🛁",
    kind: "content",
    title: "Services",
    columns: [
      { label: "Icon", key: "icon" },
      { label: "Title", key: "title" },
      { label: "Order", key: "sort_order" },
    ],
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "icon", label: "Icon (emoji)" },
      { name: "sort_order", label: "Order", type: "number", default: 0 },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        wide: true,
      },
    ],
  },
  testimonials: {
    label: "Testimonials",
    icon: "💬",
    kind: "content",
    title: "Testimonials",
    columns: [
      { label: "Photo", render: thumb },
      { label: "Name", key: "name" },
      { label: "Role", key: "role" },
      {
        label: "Message",
        render: (r) => {
          const m = r.message || "";
          return m.slice(0, 70) + (m.length > 70 ? "…" : "");
        },
      },
    ],
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "role", label: "Role" },
      { name: "sort_order", label: "Order", type: "number", default: 0 },
      { name: "image", label: "Photo", type: "image" },
      {
        name: "message",
        label: "Message",
        type: "textarea",
        required: true,
        wide: true,
      },
    ],
  },
  news: {
    label: "Fur News",
    icon: "📰",
    kind: "content",
    title: "Latest fur news",
    columns: [
      { label: "Image", render: thumb },
      { label: "Title", key: "title" },
      { label: "Author", key: "author" },
      { label: "Published", render: (r) => date(r.published_at) },
    ],
    fields: [
      { name: "title", label: "Title", required: true, wide: true },
      { name: "author", label: "Author", default: "Admin" },
      { name: "published_at", label: "Publish date", type: "date" },
      { name: "image", label: "Image", type: "image" },
      { name: "excerpt", label: "Excerpt", type: "textarea", wide: true },
    ],
  },
  faqs: {
    label: "FAQs",
    icon: "❓",
    kind: "content",
    title: "Frequently asked questions",
    columns: [
      { label: "Question", key: "question" },
      { label: "Order", key: "sort_order" },
    ],
    fields: [
      { name: "question", label: "Question", required: true, wide: true },
      { name: "sort_order", label: "Order", type: "number", default: 0 },
      {
        name: "answer",
        label: "Answer (one tip per line)",
        type: "textarea",
        required: true,
        wide: true,
        rows: 7,
      },
    ],
  },
  applications: {
    label: "Adoption Applications",
    icon: "📋",
    kind: "inbox",
    title: "Adoption applications",
    statusField: "status",
    statuses: ["pending", "approved", "rejected"],
    columns: [
      { label: "Received", render: (r) => date(r.created_at) },
      { label: "Applicant", key: "full_name" },
      { label: "Pet", render: (r) => r.pet?.name || "—" },
      { label: "Contact", render: (r) => `${r.email} · ${r.phone}` },
    ],
    details: (r) => [
      ["Pet", r.pet?.name || "—"],
      ["Applicant", r.full_name],
      ["Email", r.email],
      ["Phone", r.phone],
      ["Address", r.address],
      ["Living situation", r.living_situation || "—"],
      ["Reason", r.reason],
    ],
  },
  messages: {
    label: "Messages",
    icon: "✉️",
    kind: "inbox",
    title: "Contact messages",
    readField: "is_read",
    columns: [
      { label: "Received", render: (r) => date(r.created_at) },
      { label: "From", render: (r) => `${r.name} <${r.email}>` },
      { label: "Subject", key: "subject" },
    ],
    details: (r) => [
      ["From", r.name],
      ["Email", r.email],
      ["Subject", r.subject],
      ["Message", r.message],
    ],
  },
  appointments: {
    label: "Consultations",
    icon: "📅",
    kind: "inbox",
    title: "Free consultation requests",
    statusField: "status",
    statuses: ["pending", "confirmed", "done", "cancelled"],
    columns: [
      { label: "Received", render: (r) => date(r.created_at) },
      { label: "Name", key: "full_name" },
      { label: "Service", key: "service" },
      { label: "Preferred date", render: (r) => date(r.preferred_date) },
    ],
    details: (r) => [
      ["Name", r.full_name],
      ["Email", r.email],
      ["Phone", r.phone || "—"],
      ["Service", r.service],
      ["Preferred date", date(r.preferred_date)],
      ["Notes", r.notes || "—"],
    ],
  },
};

export const NAV_ORDER = [
  "applications",
  "appointments",
  "messages",
  "pets",
  "vets",
  "services",
  "testimonials",
  "news",
  "faqs",
];
