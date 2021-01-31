module.exports = {
  async headers() {
    return [
      {
        source: '/api/spotify',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'http://localhost:8080',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Origin, X-Requested-With, Content-Type, Accept',
          },
        ],
      },
    ]
  },
}