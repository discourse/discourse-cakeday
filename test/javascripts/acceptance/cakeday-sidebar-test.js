import { test } from "qunit";
import I18n from "I18n";
import { click, currentURL, visit } from "@ember/test-helpers";
import {
  acceptance,
  exists,
  query,
} from "discourse/tests/helpers/qunit-helpers";
import anniversariesFixtures from "../fixtures/anniversaries";
import birthdaysFixtures from "../fixtures/birthdays";
import { cloneJSON } from "discourse-common/lib/object";

acceptance("Cakeday - Sidebar with cakeday disabled", function (needs) {
  needs.user({
    sidebar_sections: [
      {
        id: 111,
        title: "Community",
        links: [
          {
            id: 329,
            name: "Everything",
            value: "/latest",
            icon: "layer-group",
            external: false,
            segment: "primary",
          },
          {
            id: 336,
            name: "Groups",
            value: "/g",
            icon: "user-friends",
            external: false,
            segment: "secondary",
          },
        ],
        slug: "community",
        public: true,
        section_type: "community",
      },
    ],
  });

  needs.settings({
    cakeday_enabled: false,
    cakeday_birthday_enabled: false,
    navigation_menu: "sidebar",
  });

  test("anniversaries sidebar link is hidden", async function (assert) {
    await visit("/");

    await click(
      ".sidebar-section[data-section-name='community'] .sidebar-more-section-links-details-summary"
    );

    assert.ok(
      !exists(".sidebar-section-link[data-link-name='anniversaries']"),
      "it does not display the anniversaries link in sidebar"
    );
  });

  test("birthdays sidebar link is hidden", async function (assert) {
    await visit("/");

    await click(
      ".sidebar-section[data-section-name='community'] .sidebar-more-section-links-details-summary"
    );

    assert.ok(
      !exists(".sidebar-section-link[data-link-name='birthdays']"),
      "it does not display the birthdays link in sidebar"
    );
  });
});

acceptance("Cakeday - Sidebar with cakeday enabled", function (needs) {
  needs.user({
    sidebar_sections: [
      {
        id: 111,
        title: "Community",
        links: [
          {
            id: 329,
            name: "Everything",
            value: "/latest",
            icon: "layer-group",
            external: false,
            segment: "primary",
          },
          {
            id: 336,
            name: "Groups",
            value: "/g",
            icon: "user-friends",
            external: false,
            segment: "secondary",
          },
        ],
        slug: "community",
        public: true,
        section_type: "community",
      },
    ],
  });

  needs.settings({
    cakeday_enabled: true,
    cakeday_birthday_enabled: true,
    navigation_menu: "sidebar",
  });

  needs.pretender((server, helper) => {
    server.get("/cakeday/anniversaries", () =>
      helper.response(cloneJSON(anniversariesFixtures))
    );
    server.get("/cakeday/birthdays", () =>
      helper.response(cloneJSON(birthdaysFixtures))
    );
  });

  test("clicking on anniversaries link", async function (assert) {
    await visit("/");

    await click(
      ".sidebar-section[data-section-name='community'] .sidebar-more-section-links-details-summary"
    );

    assert.strictEqual(
      query(
        ".sidebar-section-link[data-link-name='anniversaries']"
      ).textContent.trim(),
      I18n.t("anniversaries.title"),
      "displays the right text for the link"
    );

    assert.strictEqual(
      query(".sidebar-section-link[data-link-name='anniversaries']").title,
      I18n.t("anniversaries.title"),
      "displays the right title for the link"
    );

    await click(".sidebar-section-link[data-link-name='anniversaries']");

    assert.strictEqual(
      currentURL(),
      "/cakeday/anniversaries/today",
      "it navigates to the right page"
    );
  });

  test("clicking on birthdays link", async function (assert) {
    await visit("/");

    await click(
      ".sidebar-section[data-section-name='community'] .sidebar-more-section-links-details-summary"
    );

    assert.strictEqual(
      query(
        ".sidebar-section-link[data-link-name='birthdays']"
      ).textContent.trim(),
      I18n.t("birthdays.title"),
      "displays the right text for the link"
    );

    assert.strictEqual(
      query(".sidebar-section-link[data-link-name='birthdays']").title,
      I18n.t("birthdays.title"),
      "displays the right title for the link"
    );

    await click(".sidebar-section-link[data-link-name='birthdays']");

    assert.strictEqual(
      currentURL(),
      "/cakeday/birthdays/today",
      "it navigates to the right page"
    );
  });
});
