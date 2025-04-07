const form = document.querySelector("#formPointInteret");

async function sendData() {
  const formData = new FormData(form);
  var object = {};
  formData.forEach((value, key) => (object[key] = value));
  var json = JSON.stringify(object);
  try {
    const response = await fetch("/pointInteret/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: json,
    });
    console.log(await response.json());
  } catch (e) {
    console.error(e);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendData();
});

const typeDeLieu = document.querySelector("#TypeDeLieuForm");
console.log(typeDeLieu);
typeDeLieu.addEventListener("change", () => {
  if (typeDeLieu.value == "Atelier de réparation vélo") {
    $("#lagitudeContainer").hide();
    $("#longitudeContainer").hide();
  } else {
    $("#lagitudeContainer").show();
    $("#longitudeContainer").show();
  }
});
// $("#TypeDeLieu").on("change", function () {
//   console.log("lol");
//   if (typeDeLieu.value == "Fontaine à boire") {
//     console.log("Hey");
//   }
// });
