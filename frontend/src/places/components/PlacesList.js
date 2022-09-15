import React from "react";
import Card from "../../shared/components/UIElements/Card";
import PlaceItem from './PlaceItem';
import Button from "../../shared/components/FormElements/Button";

const PlacesList=(props)=>{

        if (props.items.length === 0) {
          return (
            <div className="place-list center">
              <Card>
                <h2>No Places Shared.</h2>
                <Button to='/places/new'>SHARE PLACE</Button>
              </Card>
            </div>
          );
        }
        return (
          <ul className="place-list">
            {props.items.map(place => (
            <PlaceItem
              key={place.id}
              id={place.id}
              title={place.title}
              description={place.description}
              image={place.image}
              address={place.address}
              coordinates={place.location}
              creatorId={place.creatorId}
              onDelete={props.onDeletePlace}
            />
            ))}
          </ul>
        );
}

export default PlacesList;