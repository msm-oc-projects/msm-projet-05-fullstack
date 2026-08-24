describe('MDD MVP journey', () => {
  it('registers, subscribes, publishes, comments and logs out', () => {
    const suffix = Date.now();
    const username = `e2e${suffix}`;
    const email = `${username}@example.com`;
    const password = 'Valid1!password';
    const title = `Article E2E ${suffix}`;
    const content = 'Contenu cree par le scenario Cypress.';
    const comment = 'Commentaire cree par le scenario Cypress.';

    cy.intercept('POST', '**/api/auth/register').as('register');
    cy.intercept('GET', '**/api/topics').as('topics');
    cy.intercept('POST', '**/api/topics/*/subscription').as('subscribe');
    cy.intercept('POST', '**/api/articles').as('createArticle');
    cy.intercept('POST', '**/api/articles/*/comments').as('createComment');

    cy.visit('/auth');
    cy.contains("S'inscrire").click();
    cy.get('#register-email').type(email);
    cy.get('#register-username').type(username);
    cy.get('#register-password').type(password);
    cy.get('form').contains("S'inscrire").click();
    cy.wait('@register').its('response.statusCode').should('eq', 201);

    cy.location('pathname').should('eq', '/articles');
    cy.contains('Articles').should('be.visible');
    cy.contains('Thèmes').click();
    cy.wait('@topics').its('response.statusCode').should('eq', 200);
    cy.get('.topic-card').first().within(() => {
      cy.contains("S'abonner").click();
    });
    cy.wait('@subscribe').its('response.statusCode').should('eq', 204);
    cy.get('.topic-card').first().should('contain.text', 'Déjà abonné');

    cy.contains('Articles').click();
    cy.contains('Créer un article').click();
    cy.get('select[formControlName="topicId"] option')
      .eq(1)
      .invoke('val')
      .then((topicId) => {
        cy.get('select[formControlName="topicId"]').select(String(topicId));
      });
    cy.get('input[formControlName="title"]').type(title);
    cy.get('textarea[formControlName="content"]').type(content);
    cy.get('form').contains('Créer').click();
    cy.wait('@createArticle').its('response.statusCode').should('eq', 201);

    cy.contains(title).should('be.visible');
    cy.get('textarea').should('be.visible').type(comment).should('have.value', comment);
    cy.get('form').contains('Envoyer').should('not.be.disabled').click();
    cy.wait('@createComment').its('response.statusCode').should('eq', 201);
    cy.contains(comment).should('be.visible');

    cy.get('a[aria-label="Profil utilisateur"]').click();
    cy.get('input[formControlName="username"]').clear().type(`${username}updated`);
    cy.contains('Sauvegarder').click();
    cy.contains('Profil mis à jour.').should('be.visible');
    cy.contains('Se désabonner').click();
    cy.contains('Aucun abonnement.').should('be.visible');

    cy.contains('Se déconnecter').click();
    cy.location('pathname').should('eq', '/auth');
    cy.contains('Bienvenue sur MDD').should('be.visible');
  });
});
