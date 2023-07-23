// admin.js
document.addEventListener("DOMContentLoaded", () => {
    const addUserForm = document.getElementById("addUserForm");
    const deleteUserButtons = document.getElementsByClassName("delete-user");
  
    // Add event listener for adding a user
    addUserForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const username = addUserForm.elements.username.value;
      const email = addUserForm.elements.email.value;
      const password = addUserForm.elements.password.value;
  
      // Send a POST request to the server to add the user
      fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("User added:", data);
          // Reload the page to update the user list
          location.reload();
        })
        .catch((error) => {
          console.error("Error adding user:", error);
        });
    });
  
    // Add event listener for deleting a user
    for (const button of deleteUserButtons) {
      button.addEventListener("click", () => {
        const userId = button.dataset.id;
  
        // Send a DELETE request to the server to delete the user
        fetch(`/api/users/${userId}`, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("User deleted:", data);
            // Reload the page to update the user list
            location.reload();
          })
          .catch((error) => {
            console.error("Error deleting user:", error);
          });
      });
    }
  });
  