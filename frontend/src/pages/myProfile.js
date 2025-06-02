import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import Header from "../components/headerTwo";
import axios from "axios";
import PageSEO from "../components/pageSEO";

export default function MyProfile() {
  const [activeTab, setActiveTab] = useState("Basic Details");
  const [profileData, setProfileData] = useState(null);
  const API = process.env.REACT_APP_API_BASE_URL;
  const currentUrl = window.location.href;

  const tabs = [
    "Basic Details",
    "Additional Details",
    "Spouse Details",
    "Personal Preferences",
  ];

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    axios.get(`${API}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setProfileData(res.data))
    .catch((err) => console.error("Profile fetch failed:", err));
  }
}, [API]);


  const renderTabContent = () => {
    if (!profileData) {
      return (
        <p className="italic">No data available. Please edit your profile.</p>
      );
    }

    switch (activeTab) {
      case "Basic Details":
        return (
          <div className="flex flex-wrap space-y-2 w-full md:w-4/5">
            <div className="flex  w-full md:w-1/4 flex-col gap-4 items-center mb-4">
              {profileData.profileImage ? (
                <img
                  src={`${API}${profileData.profileImage}`}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-300" />
              )}

            </div>
            <div className="w-full md:w-3/4 flex flex-col gap-4">
              <p>
                <strong>Salutation:</strong><br/>{profileData.salutation || "-"}
              </p>
              <p>
                <strong>First name:</strong><br/>{profileData.firstName || "-"}
              </p>
              <p>
                <strong>Last name:</strong><br/>{profileData.lastName || "-"}
              </p>
              <p>
                <strong>Email address:</strong><br/>{profileData.email || "-"}
              </p>
            </div>
          </div>
        );
      case "Additional Details":
        return (
          <div className="space-y-2">
            <p>
              <strong>Home Address:</strong><br/>{profileData.address || "-"}
            </p>
            <p>
              <strong>Country:</strong><br/>{profileData.country || "-"}
            </p>
            <p>
              <strong>Postal Code:</strong><br/>{profileData.postalCode || "-"}
            </p>
            <p>
              <strong>Date of Birth:</strong><br/>{profileData.dob || "-"}
            </p>
            <p>
              <strong>Gender:</strong><br/>{profileData.gender || "-"}
            </p>
            <p>
              <strong>Marital Status:</strong><br/>{profileData.maritalStatus || "-"}
            </p>
          </div>
        );
      case "Spouse Details":
        return (
          <div className="space-y-2">
            <p>
              <strong>Salutation:</strong><br/>{profileData.spouseSalutation || "-"}
            </p>
            <p>
              <strong>First Name:</strong><br/>{profileData.spouseFirstName || "-"}
            </p>
            <p>
              <strong>Last Name:</strong><br/>{profileData.spouseLastName || "-"}
            </p>
          </div>
        );
      case "Personal Preferences":
        return (
          <div className="space-y-2">
            <p>
              <strong>Hobbies:</strong><br/>{profileData.hobbies || "-"}
            </p>
            <p>
              <strong>Favorite Sports:</strong><br/>{profileData.sports || "-"}
            </p>
            <p>
              <strong>Music Genres:</strong><br/>{profileData.music || "-"}
            </p>
            <p>
              <strong>Movies/TV Shows:</strong><br/>{profileData.movies || "-"}
            </p>
          </div>
        );
      default:
        return (
          <p className="italic">No content available for this section yet.</p>
        );
    }
  };

  return (
    <div className="min-h-screen p-4 relative">
      <PageSEO
        title="My Profile | myApp"
        description="View your profile information on myApp"
        keywords="profile, user, myApp"
        url={currentUrl}
      />
      <Header />
      <div className="flex flex-col md:flex-row gap-6 mt-4 p-4">
        {/* Side Tabs */}
        <div className="w-full md:w-52 space-y-2 md:border-r md:pr-4">
         {tabs.map((tab) => {
            const isDisabled = tab === "Spouse Details" && profileData?.maritalStatus === "Single";
            return (
              <div
               key={tab}
                onClick={() => !isDisabled && setActiveTab(tab)}
                className={`cursor-pointer border-b-2 px-2 py-1 transition ${
                    activeTab === tab ? "border-black font-semibold" : "border-gray-300"
                } ${isDisabled ? "text-gray-400 cursor-not-allowed" : ""}`}
                >
                {tab}
              </div>
            );
          })}

        </div>

        {/* Profile Details */}
        <div className="w-auto flex-1">
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold whitespace-nowrap">
                My <span className="font-black">Profile</span>
              </h1>
              {/* Horizontal line */}
              <div className="flex-1 h-px bg-black opacity-60 mt-3 mr-5" />
            </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/edit-profile" className="text-sm underline flex items-center gap-1">Edit profile{" "} </Link>{" "}<Pencil />
            </div>
          </div>
          
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
