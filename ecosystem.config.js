module.exports = {
    apps: [
      {
        name: "V_Apurva",
        script: "npm",
        args: "run start",
        env: {
          NODE_ENV: "production",
          NEXT_PUBLIC_API_URL: "http://localhost:3059"
        }
      }
    ]
  };