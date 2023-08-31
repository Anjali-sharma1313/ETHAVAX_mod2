import { useState, useEffect } from "react";
import { ethers } from "ethers";
// import "../App.css"
import AssessmentABI from "../artifacts/contracts/Assessment.sol/Assessment.json";

const nameAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function HomePage() {
  // Property Variables

  const [message, setMessage] = useState("");
  const [currentNaming, setCurrentNaming] = useState("");

  // Requests access to the user's Meta Mask Account
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // Fetches the current value store in greeting
  async function fetchNaming() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        nameAddress,
        AssessmentABI.abi,
        provider
      );
      try {
        const data = await contract.name();
        console.log("data: ", data);
        setCurrentNaming(data);
        // document.getElementById("app").style.backgroundColor=data;
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  // Sets the greeting from input text box
  async function setNaming() {
    if (!message) return;
  
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        nameAddress,
        AssessmentABI.abi,
        signer
      );
  
      try {
        const transaction = await contract.setNaming(message);
        setMessage(" ");
        await transaction.wait();
        fetchNaming();
      } catch (error) {
        console.log(error.message);
      }
    }
  }
  

  return (

  <div className="App" id="app" style={{
    backgroundColor: "#f0f0f0",  // Change the background color
    color: "black",
    borderRadius: "40px",
    display: "flex",
    flexDirection: "column",  // Change to column layout for better arrangement
    alignItems: "center",    // Center align content horizontally
    justifyContent: "center",
    height: "100vh",          // Use 100vh to cover the entire viewport height
    padding: "20px",
}}>
    <div className="App-header">
        {/* DESCRIPTION  */}
        <div className="description" style={{ marginBottom: "20px" }}>
            <h1>Metacrafter mobile store</h1>
            <h2>Enter Mobile Brand</h2>
            <h3>with model</h3>
        </div>
        {/* BUTTONS - Fetch and Set */}
        <div className="custom-buttons" style={{ display: "flex", justifyContent: "center" }}>
            <button onClick={fetchNaming} style={{
              margin:"20px",
                padding: "10px 20px",  // Adjust button padding
                border: "3px black solid",
                borderRadius: "10px",
                marginRight: "10px",  // Decrease right margin
                color: "black",
            }}>
                Get Mobile Brand
            </button>
            
            <button onClick={setNaming} style={{
                margin:"20px",
                backgroundColor: "black",
                border: "3px white solid",
                padding: "10px 20px",  // Adjust button padding
                borderRadius: "10px",
                color: "white",
            }}>
                Put Mobile Model
            </button>
        </div>
        {/* INPUT TEXT - String  */}
        <input
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            placeholder="Enter value"
            style=
            {
              {
                border: "5px black solid",
                marginTop: "20px",
                padding: "10px",  // Adjust input padding
                borderRadius: "10px",
                width: "100%",    // Use full width
                boxSizing: "border-box",  // Include padding in width calculation
              }
            }
        />

        {/* Current Value stored on Blockchain */}
        <h2 className="naming" style={{
            padding: "20px",
            backgroundColor: "white",
            color: "black",
            border: "3px solid black",
            borderRadius: "10px",
            textAlign: "center",  // Center align text
        }}> Last entry: {currentNaming}</h2>
    </div>
</div>
  );
}
