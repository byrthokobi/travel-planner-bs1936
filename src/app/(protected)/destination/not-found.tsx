import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Country Not Found</h1>
            <p className="mt-2 text-gray-600">
                The country you are looking for does not exist.
            </p>
            <Link
                href="/"
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Back to Finding Destinations
            </Link>
        </div>
    );
}