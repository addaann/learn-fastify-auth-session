'use strict'

import Fastify from 'fastify'
import fastifyView from '@fastify/view'
import nunjucks from 'nunjucks'
import fastifySession from '@fastify/session'
import fastifyCookie from '@fastify/cookie'
import fastifyFormbody from '@fastify/formbody'

const server = () => {
  const app = Fastify({
    logger: true
  })
  
  app.register(fastifyView, {
    engine: {
      nunjucks: nunjucks
    }
  })
  
  app.register(fastifyFormbody)
  app.register(fastifyCookie)
  app.register(fastifySession, {
    secret: 'cNaoPYAwF60HZJzkcNaoPYAwF60HZJzk',
    cookie: { 
      secure: false,
      path: '/',
      httpOnly: true
    },
    expires: 60
  })

  app.get('/login', (req, reply) => {
    if (req.session.authenticated == true) {
      reply.redirect('/')
    }
  
    req.session.regenerate()
    reply.view("templates/login.njk", { text: "text" });
  })
  
  app.post('/login', (req, reply) => {
    const { username, password } = req.body
    
    if (password == '123') {
      req.session.regenerate()
      req.session.set('user', {
        username
      })
      req.session.authenticated = true
      reply.redirect('/')
    } else {
      reply.redirect('/login')
    }
  })
  
  app.get('/logout', (req, reply) => {
    req.session.destroy()
  
    reply.redirect('/login')
  })
  
  app.get("/", (req, reply) => {
    if (!req.session.authenticated) {
      reply.redirect('/login')
    }
  
    const { sessionId, user } = req.session
    
    reply.view("templates/index.njk", { 
      sessionId: sessionId,
      user: user
    });
  });

  return app
}

export default server