import { ForNode } from "../../../../types/ast/nodes/forNode";
import { Target } from "petals-stem/dist/src/target";
import translateWhileBlock from "./whileBlock";
import { Block } from "petals-stem/dist/src/block";
import { translateNodeIntoBlock } from ".";
import { Context } from "../../context";
import { WhileNode } from "../../../../types/ast/nodes/while";
import { TokenRange } from "../../../../types/token";

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
