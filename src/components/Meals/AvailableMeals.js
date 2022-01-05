import classes from "./AvailableMeals.module.css";
import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";
import { useState, useEffect, useCallback } from "react";

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchMealsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://react-d7625-default-rtdb.firebaseio.com/meals.json",
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();
      const loadedMeals = [];
      console.log(data);

      for (const key in data) {
        console.log(key);
        loadedMeals.push({
          id: key,
          key: key,
          name: data[key].name,
          description: data[key].description,
          price: +data[key].price,
        });
      }

      setMeals(loadedMeals);
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMealsData();
  }, [fetchMealsData]);

  if (isLoading) {
    return (
      <section className={classes.MealsLoading}>
        <p>Loading</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={classes.MealsError}>
        <p>{error}</p>
      </section>
    );
  }

  const mealsList = meals.map((meal) => {
    return (
      <MealItem
        id={meal.id}
        key={meal.id}
        name={meal.name}
        description={meal.description}
        price={meal.price}
      />
    );
  });

  let content = <p>Found no meals</p>;

  if (meals.length > 0) {
    content = (
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    );
  }
  if (error) {
    content = <p>{error}</p>;
  }

  return <section className={classes.meals}>{content}</section>;
};
export default AvailableMeals;
