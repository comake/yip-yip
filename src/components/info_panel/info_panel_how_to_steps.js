import howToSteps from '../../data/how_to_steps.json';

const InfoPanelHowToSteps = () => {
  return (
    <ol>
      { howToSteps.map(step => {
          return <li class={'yipyip-info-panel-list-item'}>{step}</li>
        })
      }
    </ol>
  )
}

export default InfoPanelHowToSteps;
