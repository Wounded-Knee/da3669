import React from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router';
import { getComponentByType } from '../../components/entities';
import { core } from '../../core';

const mapStateToProps = (state) => {
  return {
    entities: state.entities,
  };
};

export const View = connect(mapStateToProps)(() => {
  const entityId = parseInt(useParams().entityId);
  const entity = core.getEntityById(entityId);
  const View = entity && getComponentByType(entity.type).View;

  return entity ? <View entity={entity} /> : <p>Entity #{entityId} Not Found</p>;
});
