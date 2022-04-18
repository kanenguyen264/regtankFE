const randomGenerator = (number) => {
  return Math.round(Math.random() * (number - 2));
};

function intercept() {
  cy.intercept("/kyt/requests").as("request");
  cy.intercept(/kyt\/archive($|\?)/).as("archiveRequest");
  cy.intercept(/kyt\/archive\/remove/).as("archiveRemove");
}

describe("archive module in KYT list page", () => {
  let archivedIds = [];
  let addedItemsCount = 2;
  let initialTotal = 0;

  before(() => {
    cy.login();
    cy.saveLocalStorage();

    cy.window()
      .its("KYTArchiveService")
      .invoke("getAll")
      .then((response) => {
        const kytIds = response.data.records.map((r) => r.kytId);
        return cy.window().its("KYTArchiveService").invoke("remove", kytIds);
      });
  });
  beforeEach(() => {
    intercept();
  });
  it("add item from main list to archive", () => {
    cy.visit("/app/kyt/my-kyt");
    cy.wait("@request")
      .its("response.body.total_records")
      .then((v) => (initialTotal = v));
    cy.getCy("customTable-row")
      .its("length")
      .then((length) => {
        const elementIndexes = [];
        for (let i = 0; i < addedItemsCount; i++) {
          let index;
          do {
            index = randomGenerator(length);
          } while (elementIndexes.indexOf(index) >= 0 || index === 0);
          elementIndexes.push(index);
        }
        elementIndexes.forEach((elementIndex) => {
          cy.toggleCustomTableRow(elementIndex).then((id) =>
            archivedIds.push(id)
          );
        });
        cy.getCy("bulk-actions").click();
        cy.getCy("addToArchive").click();
      });
    // });
    // it("assert XHR call diffs after added items to archive", () => {
    //   cy.restoreLocalStorage();
    cy.wait(["@archiveRequest", "@request"]).spread(
      (archiveRequest, request) => {
        cy.wrap(archiveRequest)
          .its("response.body.total_records")
          .should("eq", addedItemsCount);
        cy.wrap(request)
          .its("response.body.total_records")
          .should((afterArchived) => {
            expect(initialTotal).to.equal(afterArchived + addedItemsCount);
          });
      }
    );
  });
  it("review items in tab Archive", () => {
    cy.restoreLocalStorage();
    cy.getCy("tabArchive").click();
    cy.wait("@archiveRequest").its("response.statusCode").should("eq", 200);
    cy.wrap(archivedIds).its("length").should("eq", addedItemsCount);
    cy.getCy("customTable-row", { timeout: 10000 })
      .should("have.length", addedItemsCount)
      .each(($row) => {
        cy.wrap($row)
          .find("[data-cy=id]")
          .then(($id) => {
            const id = $id.text();
            expect(archivedIds.indexOf(id)).to.be.greaterThan(-1);
          });
      });
  });
  it("review unarchived function", () => {
    cy.restoreLocalStorage();
    cy.getCy("customTable-row", { timeout: 10000 }).each(($row) => {
      cy.wrap($row).within(() => {
        // find("input[type=checkbox]").check()
        cy.getCy("id")
          .then(($id) => $id.text())
          .then((id) => {
            if (archivedIds.indexOf(id) >= 0)
              cy.getCy("customTable-rowCheck").check();
          });
      });
    });
    cy.getCy("unarchived").should("exist").click();
    cy.wait("@archiveRemove").its("response.statusCode").should("eq", 200);
    // cy.wait(3000);
    // for (let removedItem of removedItems) {
    //   cy.wrap(
    //     Cypress.$(
    //       `[data-cy=customTable-row] [data-cy=id]:contains(${removedItem})`
    //     )
    //   ).should("not.exist");
    // }
  });
});
