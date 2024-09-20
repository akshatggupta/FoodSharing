document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("partnerSignupForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Log the data to the console
    console.log("Partner Signup Form Data:", data);

    // Optional: Reset the form after submission
    form.reset();
  });
});

// document.addEventListener("DOMContentLoaded", function () {
//     const form = document.getElementById("partnerSignupForm");

//     form.addEventListener("submit", async function (event) {
//       event.preventDefault(); // Prevent the form from submitting normally

//       // Get form data
//       const formData = new FormData(form);
//       const data = Object.fromEntries(formData.entries());

//       // Log the data to the console
//       console.log("Partner Signup Form Data:", data);

//       try {
//         const response = await fetch(
//           "https://your-api-endpoint.com/partner-signup",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(data),
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const result = await response.json();
//         console.log("Success:", result);

//         // Optional: Reset the form after successful submission
//         form.reset();
//       } catch (error) {
//         console.error("Error:", error);
//       }
//     });
//   });
