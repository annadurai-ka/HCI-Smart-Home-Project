import React, { useState } from 'react';
import { Home, User, ArrowLeft, Power, Wind, Droplets, Thermometer, Cloud, Sofa, Bed, LampCeiling, Lightbulb, Fan, AirVent, Sparkles, SlidersHorizontal, ChevronRight, Mail, Phone, MapPin, Download, History, Music, LogOut, Menu, Plus } from 'lucide-react';

// Mock Data for the application
const initialRooms = {
  "Living Room": {
    icon: Sofa,
    devices: [
      { id: 'lr-fan', name: 'fan', icon: Fan, on: false },
      { id: 'lr-ac', name: 'ac', icon: AirVent, on: true },
      { id: 'lr-light', name: 'light', icon: LampCeiling, on: true },
      { id: 'lr-bulb', name: 'Bulb', icon: Lightbulb, on: false },
      { id: 'lr-purifier', name: 'Purifier', icon: Wind, on: false },
      { id: 'lr-climate', name: 'Climate', icon: Thermometer, on: true },
    ]
  },
  "Bedroom": {
    icon: Bed,
    devices: [
      { id: 'br-fan', name: 'fan', icon: Fan, on: false },
      { id: 'br-ac', name: 'ac', icon: AirVent, on: true },
      { id: 'br-light', name: 'light', icon: LampCeiling, on: true },
      { id: 'br-bulb', name: 'Bulb', icon: Lightbulb, on: false },
      { id: 'br-purifier', name: 'Purifier', icon: Sparkles, on: false },
      { id: 'br-climate', name: 'Climate', icon: Thermometer, on: true },
    ]
  },
  "Study room": {
    icon: LampCeiling,
    devices: [
        { id: 'sr-light', name: 'Desk Lamp', icon: Lightbulb, on: true },
        { id: 'sr-ac', name: 'AC', icon: AirVent, on: false },
        { id: 'sr-purifier', name: 'Purifier', icon: Wind, on: true },
    ]
  },
  "Kitchen": {
    icon: Sparkles,
    devices: [
        { id: 'kt-light', name: 'Main Light', icon: LampCeiling, on: true },
        { id: 'kt-exhaust', name: 'Exhaust Fan', icon: Fan, on: false },
        { id: 'kt-fridge', name: 'Fridge', icon: AirVent, on: true },
        { id: 'kt-oven', name: 'Oven', icon: Power, on: false },
    ]
  }
};

const userProfile = {
    name: "Kaviarasu A",
    activeSince: "June 2025",
    email: "kavi.666@gmail.com",
    phone: "+1 857 558 369",
    location: "Boston",
    avatar: "https://placehold.co/100x100/331a4d/f0abfc?text=K"
};


// Main App Component: Manages state and navigation
export default function App() {
  const [screen, setScreen] = useState('home'); // 'home', 'room', 'profile'
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomsData, setRoomsData] = useState(initialRooms);

  // ** CORRECTED STATE UPDATE LOGIC **
  // This function now correctly updates the state immutably.
  const handleToggle = (roomName, deviceId) => {
    setRoomsData(prevData => {
      // Get the specific room's data from the previous state
      const targetRoom = prevData[roomName];
      
      // Create a new devices array by mapping over the old one
      const newDevices = targetRoom.devices.map(device => {
        // If this is the device we want to toggle...
        if (device.id === deviceId) {
        const newState = !device.on;

        // Call backend to actually control device
        const shortId = deviceId.split('-')[1]; // e.g. 'fan' from 'lr-fan'
        fetch(`http://localhost:5000/device/${shortId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state: newState ? 'ON' : 'OFF' })
        }).catch(err => console.error(err));

        return { ...device, on: newState };
      }
        // Otherwise, return the device object unchanged
        return device;
      });

      // Return the new top-level state object
      return {
        ...prevData, // Copy all other rooms as they were
        [roomName]: { // Overwrite the specific room that changed
          ...targetRoom, // Copy other properties of the room (like icon)
          devices: newDevices, // Use the new, updated devices array
        },
      };
    });
  };

  const navigateToRoom = (roomName) => {
    setSelectedRoom(roomName);
    setScreen('room');
  };

  const navigateToHome = () => {
    setScreen('home');
    setSelectedRoom(null);
  };

  const navigateToProfile = () => {
    setScreen('profile');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'room':
        return <RoomScreen roomName={selectedRoom} roomData={roomsData[selectedRoom]} onBack={navigateToHome} onToggle={handleToggle} />;
      case 'profile':
        return <ProfileScreen onBack={navigateToHome} />;
      case 'home':
      default:
        return <HomeScreen rooms={roomsData} onNavigateToRoom={navigateToRoom} onNavigateToProfile={navigateToProfile} />;
    }
  };

  return (
    <div className="font-sans bg-gray-900 flex justify-center items-center min-h-screen">
      <div className="relative w-full max-w-sm h-[844px] max-h-[844px] overflow-hidden rounded-[40px] shadow-2xl bg-gradient-to-br from-[#4E3271] via-[#3A2A54] to-[#2C1A3E]">
        <div className="w-full h-full overflow-y-auto p-6 text-white scrollbar-hide">
          {renderScreen()}
        </div>
      </div>
    </div>
  );
}

// HomeScreen Component
const HomeScreen = ({ rooms, onNavigateToRoom, onNavigateToProfile }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <header className="flex justify-between items-center">
        <Menu className="w-8 h-8 text-gray-300" />
        <div>
          <h1 className="text-2xl font-bold">Hello, Kavi!</h1>
          <p className="text-sm text-gray-400">Welcome to Home</p>
        </div>
        <img src={userProfile.avatar} alt="Profile" className="w-12 h-12 rounded-full border-2 border-purple-400 cursor-pointer" onClick={onNavigateToProfile} />
      </header>

      {/* Weather Widget */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-full w-12 h-12 flex items-center justify-center text-sm font-bold">50%</div>
            <div>
              <p className="font-semibold">Mostly Cloudy</p>
              <p className="text-sm text-gray-300">Boston, MA</p>
            </div>
          </div>
          <p className="text-5xl font-light">22<span className="text-3xl align-top">°</span></p>
        </div>
        <div className="flex justify-around text-center text-xs pt-2">
          <div className="flex flex-col items-center space-y-1">
            <Thermometer className="w-5 h-5 text-orange-300" />
            <span className="text-gray-400">Sensible</span>
            <span className="font-semibold">27°C</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Droplets className="w-5 h-5 text-blue-300" />
            <span className="text-gray-400">Precipitation</span>
            <span className="font-semibold">4%</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Cloud className="w-5 h-5 text-gray-300" />
            <span className="text-gray-400">Humidity</span>
            <span className="font-semibold">66%</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Wind className="w-5 h-5 text-green-300" />
            <span className="text-gray-400">Wind</span>
            <span className="font-semibold">16 km/h</span>
          </div>
        </div>
      </div>

      {/* Your Rooms Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Rooms</h2>
          <button className="flex items-center space-x-1 text-sm bg-orange-500/80 px-3 py-1 rounded-lg">
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(rooms).map(([name, data], index) => (
            <RoomCard key={name} name={name} icon={data.icon} deviceCount={data.devices.length} onSelect={() => onNavigateToRoom(name)} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

// RoomCard Component
const RoomCard = ({ name, icon: Icon, deviceCount, onSelect, index }) => {
    const isSelected = name === "Bedroom"; // For styling based on figma
    const cardStyle = {
        animationDelay: `${index * 100}ms`
    };
    return (
        <div 
            className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 animate-fade-in-up ${isSelected ? 'bg-gradient-to-br from-orange-400 to-pink-500 shadow-lg' : 'bg-white/10 backdrop-blur-sm'}`}
            onClick={onSelect}
            style={cardStyle}
        >
            <Icon className="w-8 h-8 mb-3" />
            <p className="font-bold">{name}</p>
            <p className="text-xs text-gray-300">{deviceCount < 10 ? `0${deviceCount}` : deviceCount} Device{deviceCount !== 1 && 's'}</p>
        </div>
    );
};


// RoomScreen Component
const RoomScreen = ({ roomName, roomData, onBack, onToggle }) => {
  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <header className="flex items-center space-x-4 mb-6">
        <button onClick={onBack} className="p-2 bg-white/10 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-2 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-gray-800">{roomName}</h1>
        </div>
      </header>

      {/* Devices Grid */}
      <div className="flex-grow grid grid-cols-2 gap-4">
        {roomData.devices.map((device, index) => (
          <DeviceToggle key={device.id} device={device} onToggle={() => onToggle(roomName, device.id)} index={index} />
        ))}
      </div>
      
      {/* Bottom Nav Placeholder */}
      <footer className="mt-auto pt-4 flex justify-around items-center bg-white/5 backdrop-blur-lg rounded-2xl p-2 -mx-2">
        <div className="p-3 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl">
            <SlidersHorizontal className="w-6 h-6" />
        </div>
        <div className="p-3 rounded-xl">
            <Home className="w-6 h-6 text-gray-400" />
        </div>
        <div className="p-3 rounded-xl">
            <User className="w-6 h-6 text-gray-400" />
        </div>
      </footer>
    </div>
  );
};

// DeviceToggle Component
const DeviceToggle = ({ device, onToggle, index }) => {
  const toggleStyle = {
      animationDelay: `${index * 100 + 100}ms`
  };
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex flex-col justify-between animate-fade-in-up" style={toggleStyle}>
      <div className="flex justify-between items-start">
        <device.icon className={`w-7 h-7 transition-colors ${device.on ? 'text-orange-400' : 'text-gray-400'}`} />
      </div>
      <div>
        <p className="font-semibold mt-4">{device.name}</p>
        <div className="flex items-center justify-between mt-2">
          <span className={`text-sm font-bold ${device.on ? 'text-white' : 'text-gray-400'}`}>{device.on ? 'On' : 'Off'}</span>
          <button
            onClick={onToggle}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ${device.on ? 'bg-gradient-to-r from-orange-400 to-pink-500' : 'bg-gray-600'}`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${device.on ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};


// ProfileScreen Component
const ProfileScreen = ({ onBack }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <header className="flex items-center space-x-4">
                <button onClick={onBack} className="p-2 bg-white/10 rounded-full">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Profile</h1>
            </header>

            {/* Profile Info */}
            <div className="flex flex-col items-center space-y-3">
                <img src={userProfile.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-purple-400" />
                <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                <p className="text-sm text-gray-400">Active since - {userProfile.activeSince}</p>
                <button className="px-6 py-2 text-sm font-semibold bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-lg">
                    Edit Profile
                </button>
            </div>

            {/* Personal Information */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-300">Personal Information</h3>
                <div className="space-y-2">
                    <InfoRow icon={Mail} label="Email:" value={userProfile.email} />
                    <InfoRow icon={Phone} label="Phone:" value={userProfile.phone} />
                    <InfoRow icon={MapPin} label="Location:" value={userProfile.location} />
                </div>
            </div>

            {/* Utility */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-300">Utility</h3>
                <div className="space-y-2">
                    <UtilityRow icon={Download} text="Download the logs" />
                    <UtilityRow icon={History} text="Past devices" />
                    <UtilityRow icon={Music} text="Sound settings" />
                    <UtilityRow icon={LogOut} text="Log Out" />
                </div>
            </div>
        </div>
    );
};

// Helper component for profile info rows
const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center bg-purple-900/50 p-3 rounded-lg">
        <Icon className="w-5 h-5 text-purple-300 mr-4" />
        <div className="text-sm">
            <p className="text-gray-400">{label}</p>
            <p className="font-semibold">{value}</p>
        </div>
    </div>
);

// Helper component for utility rows
const UtilityRow = ({ icon: Icon, text }) => (
    <div className="flex items-center justify-between bg-purple-900/50 p-3 rounded-lg cursor-pointer hover:bg-purple-900/80 transition-colors">
        <div className="flex items-center">
            <Icon className="w-5 h-5 text-purple-300 mr-4" />
            <p className="font-semibold text-sm">{text}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
    </div>
);

// Added some basic CSS for animations and scrollbar hiding
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-in-out;
  }
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up {
    animation: fade-in-up 0.5s ease-in-out forwards;
    opacity: 0;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.appendChild(style);
