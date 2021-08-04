import Layer from './Layer';

export const Layers = ({ layers, isOpen }) => {
    return (
        <>
            {layers.map((layer, index) => {
                return (
                    <Layer key={layer.id} layer={layer} isOpen={isOpen} index={index}></Layer>
            )})}
        </>
    );
  };

export default Layers;