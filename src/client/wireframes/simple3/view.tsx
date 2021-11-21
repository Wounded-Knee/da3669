import React from 'react';
import { connect } from 'react-redux';
import { EntityView, MessageView, ImageView } from '../../components/Entities';
import { View as YouTubeView } from '../../components/entities/YouTube';
import { entityTypes } from '../../../shared/lib/classes/entities';

const mapStateToProps = (state) => {
  return {
    entities: state.entities,
  };
};

const getEntityView = (type) => {
  switch (type) {
    case entityTypes.YOUTUBE:
      return YouTubeView;
    case entityTypes.IMAGE:
      return ImageView;
    case entityTypes.MESSAGE:
      return MessageView;
    default:
      return EntityView;
  }
};

export const View = connect(mapStateToProps)(({ entityId, core }) => {
  const entity = core.getEntityById(entityId);
  const View = entity && getEntityView(entity.type);

  return entity ? <View entity={entity} /> : <p>Entity #{entityId} Not Found</p>;
});
