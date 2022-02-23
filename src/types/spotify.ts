// https://developer.spotify.com/documentation/web-api/reference/#/operations/get-current-users-profile
export interface SpotifyProfile {
  country: string;
  display_name: string | null;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  href: string;
  id: string;
  images: [
    {
      url: string;
      height: number | null;
      width: number | null;
    }
  ];
  product: "premium" | "free" | "open";
  type: "user";
  uri: string;
}
