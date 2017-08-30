import * as React from 'react';
import * as ReactTooltip from 'react-tooltip';
import { ActionHelp } from 'material-ui/svg-icons';
import './dicom-table.css';

export interface ValidationTooltipProps {
    vrTooltip: string;
}

export interface ValidationTooltipState {

}

export class ValidationTooltip extends React.Component<ValidationTooltipProps, ValidationTooltipState> {
    public constructor(props: ValidationTooltipProps) {
        super(props);
    }
    public render() {
        let tooltipRows = this.splitTooltip(this.props.vrTooltip[1]);

        return (
            <div className="tooltip">
                <ActionHelp
                    className="row-icon-help tooltip"
                    data-tip=""
                    data-for="global"
                />
                <ReactTooltip id="global" aria-haspopup="true" place="left" effect="solid">
                    <p> {this.props.vrTooltip[0]} </p>
                    <ul className="list_nobullets">
                        {tooltipRows.map( (tooltipRow, index) => {
                            return <li key={index}>{tooltipRow}</li>;
                        })}
                    </ul>
                </ReactTooltip>
            </div>
        );
    }
    /**
     * 
     * @param tooltip contains the whole tooltip in one string
     * @description function splits one string into array of string. Function takes into account 
     * words and splits only by white spaces. If string contains \n symbol, the function will split
     * the string at this point
     * @return array of strings, one string for line
     */
    private splitTooltip(tooltip: string): string[] {
        let counter: number = 0;
        let result: string[] = [];
        let maxLineLength = 40;
        for (var i = 0; i < tooltip.length; i++) {
            if (tooltip[i] === '\n') {
                result.push(tooltip.substring(i - counter, i));
                counter = 0;
            }
            if (counter > maxLineLength) {
                if (tooltip[i] === ' ') {
                    result.push(tooltip.substring(i - counter, i));
                    counter = 0;
                } else {
                    counter++;
                    continue;
                }
            }

            counter++;
        }
        // add the end of the string
        if (counter > 0) {
            result.push(tooltip.substring(tooltip.length - counter));
        }

        return result;
    }
}