import { Block, Target } from "petals-stem";

import { translateNodeIntoBlock } from ".";
import { ForNode } from "../../../../types/ast/nodes/forNode";
import { WhileNode } from "../../../../types/ast/nodes/while";
import { TokenRange } from "../../../../types/token";
import { Context } from "../../context";
import translateWhileBlock from "./whileBlock";

export default function (forBlock: ForNode, target: Target, thread: Block, context: Context): void {
  const firstStep = forBlock.getFirstStep();
  const secondStep = forBlock.getSecondStep();
  const thirdStep = forBlock.getThirdStep();

  context.enter();

  thread.getTail().append(translateNodeIntoBlock(firstStep, target, context));

  translateWhileBlock(
    new WhileNode(
      new TokenRange(forBlock.getTokenRange()),
      secondStep,
      [ ...forBlock.getContents(), thirdStep ]
    ),
    target,
    thread,
    context,
  )
}