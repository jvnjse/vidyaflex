import React from 'react';

const Header = () => (
    <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="text-2xl font-bold text-orange-500">E-tutor</div>
            <div className="flex items-center space-x-4">
                <input type="text" placeholder="Search" className="border rounded px-2 py-1" />
                <a href="#" className="text-gray-600 hover:text-gray-900">Courses</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Teachers</a>
                <button className="bg-orange-500 text-white px-4 py-2 rounded">Sign Up</button>
            </div>
        </nav>
    </header>
);

const Hero = () => (
    <section className="container mx-auto px-4 py-16 flex items-center">
        <div className="w-1/2">
            <h1 className="text-4xl font-bold mb-4">Learn with expert anytime anywhere</h1>
            <p className="mb-6">Our mission is to help people to find the best course online and learn with expert anytime, anywhere.</p>
            <button className="bg-orange-500 text-white px-6 py-3 rounded">Create account</button>
        </div>
        <div className="w-1/2">
            <img src="https://source.unsplash.com/random/600x400?education" alt="Learning" className="rounded-lg shadow-lg" />
        </div>
    </section>
);

const CategoryButton = ({ icon, name }) => (
    <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg p-4">
        <span className="mr-2">{icon}</span>
        <span>{name}</span>
    </button>
);

const Categories = () => (
    <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Browse top category</h2>
        <div className="grid grid-cols-4 gap-4">
            <CategoryButton icon="📚" name="Legal" />
            <CategoryButton icon="💼" name="Business" />
            <CategoryButton icon="💰" name="Finance & Accounting" />
            <CategoryButton icon="💻" name="IT & Software" />
            <CategoryButton icon="🧠" name="Personal Development" />
            <CategoryButton icon="📊" name="Office Productivity" />
            <CategoryButton icon="📣" name="Marketing" />
            <CategoryButton icon="📷" name="Photography & Video" />
        </div>
    </section>
);

const CourseCard = ({ title, instructor, rating, students, price, image }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="p-4">
            <h3 className="font-bold mb-2">{title}</h3>
            <p className="text-sm text-gray-600 mb-2">{instructor}</p>
            <div className="flex items-center mb-2">
                <span className="text-yellow-500 mr-1">★</span>
                <span>{rating}</span>
                <span className="text-gray-400 ml-1">({students})</span>
            </div>
            <p className="font-bold">${price}</p>
        </div>
    </div>
);

const BestSellingCourses = () => (
    <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Best selling courses</h2>
        <div className="grid grid-cols-3 gap-6">
            <CourseCard
                title="Complete Python Bootcamp"
                instructor="John Doe"
                rating="4.8"
                students="12,345"
                price="59.99"
                image="https://source.unsplash.com/random/400x300?python"
            />
        </div>
    </section>
);

const Footer = () => (
    <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-4 gap-8">
                <div>
                    <h3 className="font-bold mb-4">E-tutor</h3>
                    <p>Learn from anywhere, anytime.</p>
                </div>
                <div>
                    <h3 className="font-bold mb-4">Quick Links</h3>
                    <ul>
                        <li><a href="#" className="hover:text-orange-500">Home</a></li>
                        <li><a href="#" className="hover:text-orange-500">Courses</a></li>
                        <li><a href="#" className="hover:text-orange-500">About Us</a></li>
                        <li><a href="#" className="hover:text-orange-500">Contact</a></li>
                    </ul>
                </div>
                {/* Add more footer sections here */}
            </div>
        </div>
    </footer>
);

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Hero />
            <Categories />
            <BestSellingCourses />
            {/* Add more sections here */}
            <Footer />
        </div>
    );
};

export default LandingPage;