import React from 'react';
import { Tooltip } from 'react-tooltip';
import { formatDescription, InvestmentConfig } from '../config/investmentsConfig';

export const InvestmentBox = ({ investment }: { investment: InvestmentConfig }) => {
    const descriptionList = formatDescription(investment);
  
    return (
      <div className="investment-box">
        <h3>{investment.name}</h3>
        {/* Attach tooltip to the description */}
        <p data-tooltip-id={`tooltip-${investment.name}`} data-tooltip-content={investment.description}>
          {investment.description}
        </p>
        <Tooltip
          anchorSelect={`[data-tooltip-id="tooltip-${investment.name}"]`}
          place="top"
          render={() => (
            <ul style={{ margin: 0, padding: 0, listStyleType: 'none' }}>
              {descriptionList.map((item, index) => (
                <li key={index}>{item}</li> // Render each property in the tooltip
              ))}
            </ul>
          )}
        />
        <ul>
          {descriptionList.map((item, index) => (
            <li key={index}>{item}</li> // Render each property as a bullet point
          ))}
        </ul>
      </div>
    );
  };