import { test } from "qunit";
import I18n from "I18n";
import { click, currentURL, visit } from "@ember/test-helpers";
import { acceptance } from "discourse/tests/helpers/qunit-helpers";
import anniversariesFixtures from "../fixtures/anniversaries";
import birthdaysFixtures from "../fixtures/birthdays";
import { cloneJSON } from "discourse-common/lib/object";

acceptance("Cakeday - Sidebar with cakeday disabled", function (needs) {
  needs.user();

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

    assert
      .dom(".sidebar-section-link[data-link-name='anniversaries']")
      .doesNotExist("it does not display the anniversaries link in sidebar");
  });

  test("birthdays sidebar link is hidden", async function (assert) {
    await visit("/");

    await click(
      ".sidebar-section[data-section-name='community'] .sidebar-more-section-links-details-summary"
    );

    assert
      .dom(".sidebar-section-link[data-link-name='birthdays']")
      .doesNotExist("it does not display the birthdays link in sidebar");
  });
});

acceptance("Cakeday - Sidebar with cakeday enabled", function (needs) {
  needs.user();

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

    assert
      .dom(".sidebar-section-link[data-link-name='anniversaries']")
      .hasText(
        I18n.t("anniversaries.title"),
        "displays the right text for the link"
      );

    assert
      .dom(".sidebar-section-link[data-link-name='anniversaries']")
      .hasAttribute(
        "title",
        I18n.t("anniversaries.title"),
        "displays the right title for the link"
      );

    assert
      .dom(
        ".sidebar-section-link[data-link-name='anniversaries'] .sidebar-section-link-prefix.icon .d-icon-birthday-cake"
      )
      .exists("displays the birthday-cake icon for the link");

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

    assert
      .dom(".sidebar-section-link[data-link-name='birthdays']")
      .hasText(
        I18n.t("birthdays.title"),
        "displays the right text for the link"
      );

    assert
      .dom(".sidebar-section-link[data-link-name='birthdays']")
      .hasAttribute(
        "title",
        I18n.t("birthdays.title"),
        "displays the right title for the link"
      );

    assert
      .dom(
        ".sidebar-section-link[data-link-name='birthdays'] .sidebar-section-link-prefix.icon .d-icon-birthday-cake"
      )
      .exists("displays the birthday-cake icon for the link");

    await click(".sidebar-section-link[data-link-name='birthdays']");

    assert.strictEqual(
      currentURL(),
      "/cakeday/birthdays/today",
      "it navigates to the right page"
    );
  });
});
