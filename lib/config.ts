export const config = {
  mapbox: {
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "",
  },
  lystio: {
    apiUrl: process.env.LYSTIO_API_URL || "https://api.lystio.co",
  },
};
