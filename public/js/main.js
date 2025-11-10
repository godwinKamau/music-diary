// Used MDN guide to making an audio recorder:https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API 
const record = document.querySelector('.record')
const stop = document.querySelector('.stop')
const soundClips = document.querySelector('.sound-clips')


// fetch('/audioFromUser')
//     .then(res => {
//         return res.json()
//         // return response.blob()
//     })
//     .then(data => {console.log(data)})

//check for device support
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log("getUserMedia supported.")
    navigator.mediaDevices
    .getUserMedia(
        {
            audio:true,
        }
    )
    .then(stream => {
        const mediaRecorder = new MediaRecorder(stream)     //making the recording

        //making anonymous functions for record and stop
        record.onclick = () => {
            mediaRecorder.start(5000)
            console.log(mediaRecorder.state)
            record.style.background = 'red'
        }

        //probably need this for GF chunks
        //======Making a handler for recording
        let chunks = []
        mediaRecorder.ondataavailable = (blob) =>{
            chunks.push(blob.data)
        } 

        stop.onclick = () => {
            mediaRecorder.stop()
            console.log('What is this?',chunks)
            console.log(mediaRecorder.state)
            record.style.background = ''
        }
    
        //Saves Recording
        mediaRecorder.onstop = (e) => {
            console.log("recorder stopped")

            const clipName = prompt("Enter a name for your sound clip")

            const clipContainer = document.createElement("article");
            const clipLabel = document.createElement("p");
            const audio = document.createElement("audio");
            const deleteButton = document.createElement("button");

            clipContainer.classList.add("clip");
            audio.setAttribute("controls", "");
            deleteButton.textContent = "Delete";
            clipLabel.textContent = clipName;

            clipContainer.appendChild(audio);
            clipContainer.appendChild(clipLabel);
            clipContainer.appendChild(deleteButton);
            soundClips.appendChild(clipContainer);

            const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
            const formData = new FormData()
            formData.append('audio' , blob, `${clipName}.ogg`)
            console.log(formData)
//Learning about posting blobs from here:https://www.geeksforgeeks.org/javascript/how-can-javascript-upload-a-blob/
            fetch('/makefile',{
                method:'POST',
                
                body: formData
            })
            .then(res=>{

                chunks = [];
            })
            .catch(err => console.error(err))

            const audioURL = window.URL.createObjectURL(blob);
            audio.src = audioURL;

            deleteButton.onclick = (e) => {
                let evtTgt = e.target;
                evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
            }
        }
    })
    .catch(err => console.error(err))
}

const recordingList = document.querySelectorAll('li')

Array.from(recordingList).forEach(entry => {
    entry.addEventListener('click', () => {
        fetch(`/singularAudio/${entry.innerText}`)
            .then(response => {return response.blob()})
            .then(blob => {
                console.log(blob)
                const clipContainer = document.createElement("article");
                // const clipLabel = document.createElement("p");
                const audio = document.createElement("audio");
                // const deleteButton = document.createElement("button");

                clipContainer.classList.add("clip");
                audio.setAttribute("controls", "");
                // deleteButton.textContent = "Delete";
                // clipLabel.textContent = "yeah!";

                clipContainer.appendChild(audio);
                // clipContainer.appendChild(clipLabel);
                // clipContainer.appendChild(deleteButton);
                entry.appendChild(clipContainer);
                const audioURL = window.URL.createObjectURL(blob);
                audio.src = audioURL;    
            })
    })
})

//=====working with blobs
//     .then(blob => {
//         console.log(blob)
//         const clipContainer = document.createElement("article");
//         const clipLabel = document.createElement("p");
//         const audio = document.createElement("audio");
//         const deleteButton = document.createElement("button");

//         clipContainer.classList.add("clip");
//         audio.setAttribute("controls", "");
//         deleteButton.textContent = "Delete";
//         clipLabel.textContent = "yeah!";

//         clipContainer.appendChild(audio);
//         clipContainer.appendChild(clipLabel);
//         clipContainer.appendChild(deleteButton);
//         soundClips.appendChild(clipContainer);
//         const audioURL = window.URL.createObjectURL(blob);
//         audio.src = audioURL;
//     })
