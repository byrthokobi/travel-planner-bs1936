
export default function TripPage({ params }: { params: { id: number } }) {
    const id = params.id;
    return (
        <div className="text-center">
            Welcome, Your Trip id is {id}!
        </div>
    );
}