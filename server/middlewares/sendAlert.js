
// Function to generate dynamic HTML response

function message(msg,url,time=2) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Redirecting...</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 80vh;
          margin: 0;
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
        }
        .alert-box {
          padding: 20px;
          background-color: #333;
          color: white;
          font-size: 18px;
          border-radius: 8px;
          text-align: center;
          text-transform: capitalize;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
          .loading-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background-color: #007bff;
          animation: loading ${time*1000}ms linear forwards;
        }
        @keyframes loading {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      </style>
    </head>
    <body>
    <div class="loading-line"></div>
      <div class="alert-box">
        ${msg}
      </div>
      <script>
        // Wait for 3 seconds, then redirect to the admin page
        setTimeout(() => {
          window.location.href = '${url}';
        }, ${time * 1000});
      </script>
    </body>
    </html>
  `;
}

module.exports = {message}