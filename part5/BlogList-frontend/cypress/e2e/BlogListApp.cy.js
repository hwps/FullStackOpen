describe('Blog List App', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/tests/reset')
    
    const user = {
      "username": "test",
      "name": "Test User",
      "password": "test"
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:5173/')
  })

  it('Login form is show', function() {
    cy.contains('Blog List')
    cy.contains('Log in to application')
    cy.get("#username").should('exist')
    cy.get("#password").should('exist')
    cy.get("#login-button").should('exist')
  })

  describe('Login...', function() {
    it('...fails with wrong credentials', function() {
      cy.get('#username').type('test')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
  
      cy.contains('Incorrect username or password')
    })
    
    it('...succeeds with correct credentials', function() {
      cy.get('#username').type('test')
      cy.get('#password').type('test')
      cy.get('#login-button').click()
  
      cy.contains('Logged in as Test User')
      
    })
  })

  describe('When logged in...', function() {
    beforeEach(function() {
      cy.get('#username').type('test')
      cy.get('#password').type('test')
      cy.get('#login-button').click()
  
    })
  
    it('...a blog can be added', function() {
      cy.contains('Add new blog').click()

      cy.get('#title').type('Test Title')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('Test URL')
      cy.get('#add-blog-button').click()

      cy.get('.blogInfo').contains('Test Title')
      cy.get('.blogInfo').contains('Test Author')
    })

    
    it('...a blog can be liked', function() {
      cy.contains('Add new blog').click()

      cy.get('#title').type('Test Title')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('Test URL')
      cy.get('#add-blog-button').click()

      cy.get('#show-blogInfoExtended').click()
      cy.get('.blogInfoExtended').contains('Likes: 0')
      cy.get('#blogLikeButton').click()
      cy.get('.blogInfoExtended').contains('Likes: 1')
    })

    it('...a blog can be deleted', function() {
      cy.contains('Add new blog').click()

      cy.get('#title').type('Test Title')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('Test URL')
      cy.get('#add-blog-button').click()

      cy.get('#show-blogInfoExtended').click()
      cy.get('#blogDeleteButton').click()

      cy.contains('Test Author').should('not.exist') // "Test Title" might still be shown in the notification
    })

    it.only('...the delete button is shown only to the user who added the blog', function() {
      
      // add another user
      const anotherUser = {
        "username": "another",
        "name": "Another User",
        "password": "test"
      }
      cy.request('POST', 'http://localhost:3001/api/users/', anotherUser)


      // add blog post and log out
      cy.contains('Add new blog').click()

      cy.get('#title').type('Test Title')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('Test URL')
      cy.get('#add-blog-button').click()

      cy.contains('Log out').click()

      // log in as another user
      cy.get('#username').type('another')
      cy.get('#password').type('test')
      cy.get('#login-button').click()

      // delete button should not be visible
      cy.get('#show-blogInfoExtended').click()
      cy.get('#blogDeleteButton').should('not.be.visible')

    })



  })
})