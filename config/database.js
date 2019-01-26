module.exports = {
  'secret': process.env.DB_SECRET || 'super-secret-fallback-secret',
  'database': 'mongodb://localhost/paxos-takehome'
}
