import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaClock, FaDumbbell, FaSearch, FaFilter } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const WorkoutVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const categories = ['All', 'Chest', 'Back', 'Legs', 'Arms', 'Core', 'Cardio', 'Flexibility'];

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'workout_videos'), orderBy('title', 'asc'));
      const querySnapshot = await getDocs(q);
      const videosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVideos(videosList);
      setFilteredVideos(videosList);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Failed to load workout videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = videos;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(v => v.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(v => 
        v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredVideos(filtered);
  }, [searchTerm, selectedCategory, videos]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <FaDumbbell className="text-blue-600" /> Workout Video Library
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Follow professional workout tutorials to maximize your training
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <FaSearch className="absolute left-4 top-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search workout videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Videos Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin">
            <FaDumbbell className="text-4xl text-blue-600" />
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading videos...</p>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
          <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No videos found. Try different search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedVideo(video)}
              className="group cursor-pointer"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                {/* Thumbnail */}
                <div className="relative h-40 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaDumbbell className="text-4xl text-white opacity-50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <FaPlay className="text-white text-3xl" />
                  </div>
                  <span className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {video.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                    {video.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <FaClock size={12} />
                      <span>{video.duration || '10'} min</span>
                    </div>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {video.difficulty || 'Intermediate'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal for video details */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedVideo(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            {/* Video Player */}
            <div className="bg-black h-96 flex items-center justify-center">
              {selectedVideo.videoUrl ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={selectedVideo.videoUrl}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="text-center">
                  <FaPlay className="text-white text-6xl opacity-50 mx-auto mb-4" />
                  <p className="text-white">Video not available</p>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedVideo.title}
                  </h2>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                      {selectedVideo.category}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                      {selectedVideo.difficulty || 'Intermediate'}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {selectedVideo.description}
              </p>

              {selectedVideo.instructions && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3">Instructions:</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    {selectedVideo.instructions.map((instruction, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="text-blue-600 font-bold min-w-6">{idx + 1}.</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Duration</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedVideo.duration || '10'} min</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Difficulty</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedVideo.difficulty || 'Medium'}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Calories</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedVideo.calories || '150-200'}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Equipment</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedVideo.equipment || 'None'}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedVideo(null)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default WorkoutVideos;
