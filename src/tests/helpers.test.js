import { expect, it, describe } from "vitest";
import { formatRating, getTrailerUrl } from "../ui/helpers";

describe("Helper Functions", () => {
  it("should correctly format ratings", () => {
    expect(formatRating(7.678)).toBe("7.7");
    expect(formatRating(4)).toBe("4.0");
    expect(formatRating(5.1)).toBe("5.1");
  });

  it("should return the correct YouTube trailer URL", () => {
    const withTrailer = [
      {
        key: "uJYTz1CgN14",
        type: "Clip",
      },
      {
        key: "SWZyuEQPQYo",
        type: "Featurette",
      },
      {
        key: "1pHDWnXmK7Y",
        type: "Trailer",
      },
      {
        key: "O_A8HdCDaWM",
        type: "Teaser",
      },
    ];
    expect(getTrailerUrl(withTrailer)).toBe(
      "https://www.youtube.com/watch?v=1pHDWnXmK7Y"
    );
  });

  it("should return the first video if no trailer is found", () => {
    const withoutTrailer = [
      {
        key: "uJYTz1CgN14",
        type: "Featurette",
      },
      {
        key: "SWZyuEQPQYo",
        type: "Teaser",
      },
      {
        key: "O_A8HdCDaWM",
        type: "Clip",
      },
    ];
    expect(getTrailerUrl(withoutTrailer)).toBe(
      "https://www.youtube.com/watch?v=uJYTz1CgN14"
    );
  });

  it("should return undefined if no videos are available", () => {
    expect(getTrailerUrl([])).toBeUndefined();
  });
});

//   test("getTrailerUrl should return the correct YouTube URL", () => {
//     const videos = [{ type: "Trailer", key: "abc123" }];
//     expect(getTrailerUrl(videos)).toBe(
//       "https://www.youtube.com/watch?v=abc123"
//     );
//   });

//   test("getTrailerUrl should return undefined if no trailer is found", () => {
//     expect(getTrailerUrl([])).toBeUndefined();
//   });
// });
