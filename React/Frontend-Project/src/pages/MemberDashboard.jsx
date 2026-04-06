import { useSelector } from 'react-redux';
import { FaUserCircle, FaCalendarAlt, FaIdCard, FaBatteryFull, FaExclamationTriangle } from 'react-icons/fa';

const MemberDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { list: members } = useSelector((state) => state.members);

  // Since it's a generic login, let's derive member details from email (use prefix) if no direct match.
  // We'll search for an exact name match (mock) or just show them personal details based on user state
  const mockMemberProfile = {
    name: user.email.split('@')[0],
    email: user.email,
    plan: 'Premium Gold',
    joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Active',
    expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  };

  const isActive = mockMemberProfile.status === 'Active';

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {mockMemberProfile.name}!</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">View your membership details below</p>
      </div>

      <div className="card text-center mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            ${isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400'}`}>
            {isActive ? <><FaBatteryFull className="mr-1"/> Active</> : <><FaExclamationTriangle className="mr-1"/> Expired</>}
          </span>
        </div>

        <FaUserCircle className="text-8xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1 uppercase tracking-wider">{mockMemberProfile.name}</h2>
        <p className="text-gray-500 dark:text-gray-400">{mockMemberProfile.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card flex items-start space-x-4 border-t-4 border-blue-500">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <FaIdCard className="text-2xl text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Plan</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{mockMemberProfile.plan}</p>
            <p className="text-xs text-gray-400 mt-1">Full access to all facilities</p>
          </div>
        </div>

        <div className="card flex items-start space-x-4 border-t-4 border-purple-500">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <FaCalendarAlt className="text-2xl text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Membership Timeline</p>
            <p className="text-md font-semibold text-gray-900 dark:text-white">Joined: <span className="font-normal">{mockMemberProfile.joinDate}</span></p>
            <p className="text-md font-semibold text-gray-900 dark:text-white">Expires: <span className="font-normal text-red-500 dark:text-red-400">{mockMemberProfile.expires}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
