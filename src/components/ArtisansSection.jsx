import React from "react";
import ArtisanCard from "./ArtisanCard";
import '../styles/artisans.css';

function ArtisansSection() {
  const artisans = [
    {
      id: 1,
      name: "Ali Ahmad",
      role: "Master Weaver",
      about:
        "With over 30 years of experience, Ahmad creates intricate pashmina shawls using traditional techniques passed down through five generations.",
      image: "https://st3.depositphotos.com/9998432/13335/v/1600/depositphotos_133352010-stock-illustration-default-placeholder-man-and-woman.jpg" 
    },
    {
      id: 2,
      name: "Rao Hassan",
      role: "Pottery Craftsman",
      about:
        "Hassan specializes in the ancient art of blue pottery, bringing modern aesthetics to centuries-old craft from Multan.",
      image: "https://st3.depositphotos.com/9998432/13335/v/1600/depositphotos_133352010-stock-illustration-default-placeholder-man-and-woman.jpg" 
    },
    {
      id: 3,
      name: "Ayesha Khan",
      role: "Embroidery Artist",
      about:
        "Ayesha's detailed embroidery work transforms ordinary fabrics into wearable art, celebrating Pakistan's rich textile heritage.",
      image: "https://st3.depositphotos.com/9998432/13335/v/1600/depositphotos_133352010-stock-illustration-default-placeholder-man-and-woman.jpg" 
    }
  ];

  return (
    <div className="artisans-section">
      <h2>Meet the Artisans</h2>
      <p className="subtext">
        The skilled hands and passionate hearts behind each handcrafted piece
      </p>

      <div className="artisans-grid">
        {artisans.map((a, i) => (
          <ArtisanCard key={i} id={a.id} {...a} />
        ))}
      </div>
    </div>
  );
}

export default ArtisansSection;
