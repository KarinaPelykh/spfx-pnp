import * as React from "react";
import { useEffect, useState, type ReactNode } from "react";
import type { IFaqProps } from "./IFaqProps";
import { SPFI } from "@pnp/sp";
import { IFAQ } from "../../../interfaces";
import { getSP } from "../../../pnpjsConfig";
import { Accordion } from "@pnp/spfx-controls-react/lib/Accordion";
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";

const Faq = (props: IFaqProps): ReactNode => {
  const _sp: SPFI = getSP(props.context);

  const [faqList, setFaqList] = useState<IFAQ[]>([]);
  console.log("FSDF", _sp);

  const getFaq = async (): Promise<void> => {
    const items = _sp.web.lists
      .getById(props.listGuid)
      .items.select()
      .orderBy("Letter", true)
      .orderBy("Title", true)();

    setFaqList(
      (await items).map((item: any) => {
        return {
          Id: item.Id,
          Title: item.Title,
          Body: item.Body,
          Letter: item.Letter,
        };
      })
    );
  };

  useEffect(() => {
    if (props.listGuid && props.listGuid !== "") {
      getFaq()
        .then((data) => {
          console.log(data);
        })
        .catch((error) => console.log(error));
    }
  }, [props]);

  return (
    <>
      <WebPartTitle
        displayMode={props.displayMode}
        title={props.title}
        updateProperty={props.updateProperty}
      />
      {props.listGuid ? (
        faqList.map((o: IFAQ, index: number) => {
          return (
            <Accordion title={o.Title} key={index} defaultCollapsed={true}>
              {o.Body}
            </Accordion>
          );
        })
      ) : (
        <Placeholder
          iconName="Edit"
          iconText="Configure your web part"
          description="Please configure the web part."
          buttonLabel="Configure"
          onConfigure={() => props.context.propertyPane.open()}
        />
      )}
    </>
  );
};
export default Faq;
