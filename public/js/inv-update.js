const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("#edit-inventory-button")
      updateBtn.removeAttribute("disabled")
    })