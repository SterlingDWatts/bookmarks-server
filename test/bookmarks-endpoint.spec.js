const knex = require("knex");
const app = require("../src/app");

describe("Bookmarks Endpoints", function() {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("bookmarks").truncate());

  afterEach("clean the table", () => db("bookmarks").truncate());

  context("Given there are bookmarks in the database", () => {
    const testBookmarks = [
      {
        id: 1,
        title: "65 Questions",
        url: "https://www.algoexpert.io/",
        rating: 5,
        description: "Algorithm Practice"
      },
      {
        id: 2,
        title: "Github",
        url: "https://github.com/",
        rating: 5,
        description: "Version Control"
      },
      {
        id: 3,
        title: "WesBos",
        url: "https://wesbos.com/",
        rating: 4,
        description: "Learn to Code"
      }
    ];

    beforeEach("insert bookmarks", () => {
      return db.into("bookmarks").insert(testBookmarks);
    });

    it("GET /bookmarks responds with 200 and all of the bookmarks", () => {
      return supertest(app)
        .get("/bookmarks")
        .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
        .expect(200, testBookmarks);
    });

    it("GET /bookmarks:id responds with 200 and the specified bookmark", () => {
      const bookmarkId = 2;
      const expectedBookmark = testBookmarks[bookmarkId - 1];
      return supertest(app)
        .get(`/bookmarks/${bookmarkId}`)
        .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
        .expect(200, expectedBookmark);
    });
  });
});
