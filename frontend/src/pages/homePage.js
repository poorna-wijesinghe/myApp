import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/headerTwo";
import axios from "axios";
import PageSEO from "../components/pageSEO";

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_BASE_URL;
  const currentUrl = window.location.href;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    axios
      .get(`${API}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
        navigate("/login");
      });
  }, [navigate, API]);

  if (!user) {
    return <div className="text-center mt-20">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen p-4 relative">
      <PageSEO
        title="Home | myApp"
        description="Your profile information on myApp"
        keywords="profile, user, myApp"
        url={currentUrl}
      />
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden md:flex">
          <div className="md:w-1/3 bg-gradient-to-tr from-black to-gray-900 text-white flex flex-col items-center justify-center p-6">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white mb-4">
              {user.profileImage ? (
                <img
                  src={`${API}${user.profileImage}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-700">
                  No Image
                </div>
              )}
            </div>
            <h2 className="text-xl font-semibold">
              {user.salutation} {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-gray-300">{user.email}</p>
          </div>

          <div className="md:w-2/3 p-8 space-y-6">
            <section>
              <h3 className="text-lg font-bold border-b pb-1 mb-2">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <p><strong>DOB:</strong> {user.dob || "-"}</p>
                <p><strong>Gender:</strong> {user.gender || "-"}</p>
                <p><strong>Address:</strong> {user.address || "-"}</p>
                <p><strong>Country:</strong> {user.country || "-"}</p>
                <p><strong>Postal Code:</strong> {user.postalCode || "-"}</p>
                <p><strong>Marital Status:</strong> {user.maritalStatus || "-"}</p>
              </div>
            </section>

            {(user.spouseSalutation || user.spouseFirstName || user.spouseLastName) && (
                <section>
                <h3 className="text-lg font-bold border-b pb-1 mb-2">Spouse Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                    <p><strong>Salutation:</strong> {user.spouseSalutation || "-"}</p>
                    <p><strong>First Name:</strong> {user.spouseFirstName || "-"}</p>
                    <p><strong>Last Name:</strong> {user.spouseLastName || "-"}</p>
                </div>
                </section>
            )}

            <section>
              <h3 className="text-lg font-bold border-b pb-1 mb-2">Personal Preferences</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <p><strong>Hobbies:</strong> {user.hobbies || "-"}</p>
                <p><strong>Sports:</strong> {user.sports || "-"}</p>
                <p><strong>Music:</strong> {user.music || "-"}</p>
                <p><strong>Movies:</strong> {user.movies || "-"}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
