export const config = {
  get apiUrl() {
    return process.env.PRISMCODE_API_URL
      ?? process.env.API_URL
      ?? "https://api.prismcode.dev";
  },

  get isCloud() {
    return !this.apiUrl.includes("localhost") && !this.apiUrl.includes("127.0.0.1");
  },

  get isDev() {
    return this.apiUrl.includes("localhost") || this.apiUrl.includes("127.0.0.1");
  },
};
