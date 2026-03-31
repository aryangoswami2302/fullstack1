export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
        <p>© 2024 MyProject Assignment. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}