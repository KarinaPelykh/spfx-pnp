import * as React from "react";
import { useEffect, useState, type ReactNode } from "react";
import type { IFaqProps } from "./IFaqProps";
import { SPFI } from "@pnp/sp";
import { IFAQ } from "../../../interfaces";
import { getSP } from "../../../pnpjsConfig";
import { Accordion } from "@pnp/spfx-controls-react/lib/Accordion";

const Fag = (props: IFaqProps): ReactNode => {
  // const LOG_SOURCE = "Faq Webpart";

  // const LIST_NAME = "FAQ";

  const _sp: SPFI = getSP(props.context);

  const [faqList, setFaqList] = useState<IFAQ[]>([]);

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
      {faqList.map((o: IFAQ, index: number) => {
        return (
          <Accordion title={o.Title} key={index} defaultCollapsed={true}>
            {o.Body}
          </Accordion>
        );
      })}
    </>
  );
};
export default Fag;
