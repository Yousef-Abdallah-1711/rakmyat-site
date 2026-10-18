export const contactPageContent = {
  heading: { lead: " Get In ", emphasis: " Touch " },
  introduction: "We will contact again after receive your request in 24h",
  phone: "(+23) 5535 68 68",
  email: "contact@Itecksolution.com",
  address: "58 Howard St, San Francisco, CA 941",
  requiredHint: "The field is required mark as *",
  fields: {
    name: { name: "name", label: "Name", placeholder: "Name" },
    email: {
      name: "email",
      label: "Email Address",
      placeholder: "Email Address *",
    },
    phone: {
      name: "phone",
      label: "Phone Number",
      placeholder: "Phone Number (option)",
    },
    website: {
      name: "website",
      label: "Your Website",
      placeholder: "Your Website (option)",
    },
    help: {
      name: "option",
      label: "How can we help you?",
      placeholder: "How can we help you?",
    },
    message: {
      name: "message",
      label: "How can we help you?",
      placeholder: "How can we help you?",
    },
  },
  helpOptions: [
    { value: "how can we help", label: "How can we help you?" },
    { value: "option 1", label: "option 1" },
    { value: "option 2", label: "option 2" },
  ],
  termsCopy: "\n                                                By submitting, i’m agreed to the ",
  termsLabel: "Terms & Conditons",
  submitLabel: "Send Your Request",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24219.60999175365!2d-73.9764341314902!3d40.64198229194528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25b400c94a227%3A0x18e2a4d3fb21f0ec!2sFlatbush%2C%20Brooklyn%2C%20NY%2C%20USA!5e0!3m2!1sen!2seg!4v1651361759450!5m2!1sen!2seg",
} as const;
