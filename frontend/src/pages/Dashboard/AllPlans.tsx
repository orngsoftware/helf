import { Link } from 'react-router-dom';

const AllPlans = () => {
    const plans = [
        { id: 1, name: "Plan 1", category: "Category 1" },
        { id: 2, name: "Plan 2", category: "Category 2" },
    ];

    return (
        <div>
            <h2>All Plans</h2>
            <ul>
                {plans.map(plan => (
                    <li key={plan.id}>
                        <Link to={`/dashboard/plan/${plan.id}`}>
                            {plan.name} - {plan.category}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AllPlans;