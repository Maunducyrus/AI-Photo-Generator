const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "";
let isImageGenerating = false;

const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
const imgElement = imgCard.querySelector("img");
const downloadBtn = imgCard.querySelector(".download-btn");

//Set the image source to the AI-generated image data
const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;

imgElement.src = aiGeneratedImg;

//when the image is loaded, remove the loading class
imgElement.onload = () => {
    imgCard.classList.remove("loading");
    downloadBtn.setAttribute("href", aiGeneratedImg);
    downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);

}

    });
}

const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
        //send a request to the OpenAI API to generate images based on user inputs
const response = await fetch ("https://api.openai.com/v1/images/generations", {
    method: "POST",
headers: {
"Content-Type" : "application/json",
"Authorization" : `Bearer ${OPENAI_API_KEY}`
},
body: JSON.stringify({
prompt: userPrompt,
n: parseInt(userImgQuantity),
size: "512x512",
response_format: "b64_json"
})
}); 

if(!response.ok) throw new Error("Failed to generate images ! please try again")

const { data } = await response.json(); //Get data from the response
updateImageCard([...data]);// use OpenAI API to generate images based on user prompts
    }catch (error){
        alert(error.message);
    } finally {
        isImageGenerating = false;
    }
}

const handleFormSubmission = (e) => {
    e.preventDefault();
    if(isImageGenerating) return;
    isImageGenerating = true;

    // Get user input and image quantity values from the form
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;

    // Creating HTML markup for image cards with loading state
    const imgCardMarkup = Array.from({length: userImgQuantity}, () => 
    `        <div class="img-card loading">
            <img src="images/loader.svg" alt="image">
            <a href="#" class="download-btn">
            <img src="imgages/download.svg">
            </a>
        </div>`
    ).join("");

    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImgQuantity);
}


generateForm.addEventListener("submit", handleFormSubmission);
