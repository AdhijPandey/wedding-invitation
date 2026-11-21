
import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Music2,
  Music4,
  MapPin,
  CalendarDays,
  Clock,
  Heart,
  Share2,
  MailOpen,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";

import { weddingDetails, weddingEvents } from "./data/weddingData";
import "./index.css";

function App() {
  const [started, setStarted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [musicOn, setMusicOn] = useState(false);

  const audioRef = useRef(null);
  const touchStart = useRef(0);

  const currentEvent = weddingEvents[currentPage];

  const openInvitation = () => {
    setStarted(true);
    setCurrentPage(0);
  };

  const nextPage = () => {
    if (currentPage < weddingEvents.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    try {
      if (musicOn) {
        audioRef.current.pause();
        setMusicOn(false);
      } else {
        await audioRef.current.play();
        setMusicOn(true);
      }
    } catch {
      alert("Please add wedding.mp3 inside public/music folder.");
    }
  };

  const shareInvitation = async () => {
    const shareData = {
      title: "Wedding Invitation",
      text: `You are invited to the wedding of ${weddingDetails.groom} & ${weddingDetails.bride}!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      }
    } else {
      await navigator.clipboard.writeText(
        `${shareData.text} ${shareData.url}`
      );
      alert("Invitation link copied!");
    }
  };

  const openMap = () => {
    const address = encodeURIComponent(
      `${weddingDetails.venue}, ${weddingDetails.address}`
    );
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${address}`,
      "_blank"
    );
  };

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const distance = touchStart.current - e.changedTouches[0].clientX;

    if (distance > 60) nextPage();
    if (distance < -60) previousPage();
  };

  const whatsappRSVP = () => {
    const message = encodeURIComponent(
      `Hello! I would love to attend the wedding of ${weddingDetails.groom} & ${weddingDetails.bride}. Best wishes!`
    );

    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  return (
    <main className="wedding-app">
      <audio
        ref={audioRef}
        src={weddingDetails.music}
        loop
      />

      {!started ? (
        <motion.section
          className="cover-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="cover-flowers">✿ ❀ ✿</div>

          <div className="cover-content">
            <div className="ganesh-icon">ॐ</div>

            <p className="cover-subtitle">
              {weddingDetails.family}
            </p>

            <div className="cover-ornament">❦</div>

            <h1>Wedding<br />Invitation</h1>

            <div className="cover-heart">♥</div>

            <h2>
              {weddingDetails.groom}
              <span> & </span>
              {weddingDetails.bride}
            </h2>

            <p className="cover-date">
              {weddingDetails.weddingDate}
            </p>

            <div className="cover-elephants">
              🐘 <span>❦</span> 🐘
            </div>

            <button
              className="open-button"
              onClick={openInvitation}
            >
              <MailOpen size={19} />
              Open Invitation
              <ChevronRight size={19} />
            </button>

            <p className="cover-footer">
              A NEW JOURNEY BEGINS
            </p>
          </div>

          <div className="cover-flowers bottom">
            ✿ ❀ ✿
          </div>
        </motion.section>
      ) : (
        <section className="event-screen">
          <div className="top-bar">
            <span>✦ WEDDING CELEBRATION ✦</span>

            <button
              className="music-button"
              onClick={toggleMusic}
              aria-label="Toggle music"
            >
              {musicOn ? <Volume2 /> : <VolumeX />}
            </button>
          </div>

          <div className="progress-container">
            {weddingEvents.map((event, index) => (
              <div
                key={event.id}
                className={`progress-line ${
                  index <= currentPage ? "active" : ""
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              className={`event-card ${currentEvent.theme}`}
              initial={{ opacity: 0, rotateY: 30, x: 60 }}
              animate={{ opacity: 1, rotateY: 0, x: 0 }}
              exit={{ opacity: 0, rotateY: -30, x: -60 }}
              transition={{ duration: 0.45 }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="card-border">
                <div className="light-decoration">✦ ✧ ✦ ✧ ✦</div>

                <div className="date-badge">
                  <span>{currentEvent.day}</span>
                  <strong>{currentEvent.date.split(" ")[0]}</strong>
                  <span>
                    {currentEvent.date.split(" ")[1]}
                  </span>
                  <small>{currentEvent.date.split(" ")[2]}</small>
                </div>

                <p className="event-label">
                  {currentEvent.icon} YOU ARE INVITED
                </p>

                <h1 className="event-title">
                  {currentEvent.title}
                </h1>

                <div className="ornament-divider">
                  ❧ ✦ ❧
                </div>

                <div className="event-details">
                  <div className="detail-row">
                    <Clock size={16} />
                    <span>{currentEvent.time}</span>
                  </div>

                  <p className="second-event">
                    {currentEvent.secondEvent}
                    {currentEvent.secondTime &&
                      ` • ${currentEvent.secondTime}`}
                  </p>
                </div>

                <div className="venue-section">
                  <p className="venue-heading">✧ VENUE ✧</p>

                  <h3>{currentEvent.venue}</h3>

                  <p>{currentEvent.address}</p>

                  <button
                    className="map-button"
                    onClick={openMap}
                  >
                    <MapPin size={15} />
                    View Location
                  </button>
                </div>

                <div className="illustration">
                  {currentEvent.illustration}
                </div>

                <p className="event-description">
                  {currentEvent.description}
                </p>

                <div className="card-footer">
                  <span>WITH LOVE & BLESSINGS</span>
                  <Heart size={15} fill="currentColor" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="page-navigation">
            <button
              onClick={previousPage}
              disabled={currentPage === 0}
              className="nav-button previous"
            >
              <ChevronLeft />
              Previous
            </button>

            <div className="page-indicators">
              {weddingEvents.map((event, index) => (
                <button
                  key={event.id}
                  className={`page-dot ${
                    index === currentPage ? "selected" : ""
                  }`}
                  onClick={() => setCurrentPage(index)}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>

            {currentPage < weddingEvents.length - 1 ? (
              <button
                onClick={nextPage}
                className="nav-button next"
              >
                Next
                <ChevronRight />
              </button>
            ) : (
              <button
                onClick={whatsappRSVP}
                className="nav-button next"
              >
                RSVP
                <Heart size={16} />
              </button>
            )}
          </div>

          <div className="bottom-actions">
            <button onClick={shareInvitation}>
              <Share2 size={16} />
              Share Invitation
            </button>
          </div>

          <p className="swipe-hint">
            <Sparkles size={13} />
            Swipe left or right to explore
          </p>
        </section>
      )}
    </main>
  );
}

export default App;
