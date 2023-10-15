const schema = {
  definitions: {
    type: "object",
    properties: { email: { type: "string" }, password: { type: "string" } },
    required: ["email"],
  },
} as const;
export default schema.definitions;
