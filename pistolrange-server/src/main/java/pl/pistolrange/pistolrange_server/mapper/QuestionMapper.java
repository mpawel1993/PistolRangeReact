package pl.pistolrange.pistolrange_server.mapper;

import org.springframework.stereotype.Component;
import pl.pistolrange.pistolrange_server.api.dto.PossibleAnswerDto;
import pl.pistolrange.pistolrange_server.api.dto.QuestionDto;
import pl.pistolrange.pistolrange_server.domain.QuestionEntity;

import java.util.Arrays;

@Component
public class QuestionMapper {

    private final ThreadLocal<Integer> threadLocalInt = ThreadLocal.withInitial(() -> 1);

    public QuestionEntity mapToDomain (QuestionDto questionDto){
        var a_answer = questionDto.getPossibleAnswer()
                .stream()
                .filter(x -> x.getId().equals("a"))
                .toList().getFirst().getValue();

        var b_answer = questionDto.getPossibleAnswer()
                .stream()
                .filter(x -> x.getId().equals("b"))
                .toList().getFirst().getValue();

        var c_answer = questionDto.getPossibleAnswer()
                .stream()
                .filter(x -> x.getId().equals("c"))
                .toList().getFirst().getValue();

        return QuestionEntity.builder()
                .legacyId(questionDto.getId())
                .questionValue(questionDto.getValue())
                .goodAnswer(questionDto.getGoodAnswer())
                .paragraph(questionDto.getParagraph())
                .a_answer(a_answer)
                .b_answer(b_answer)
                .c_answer(c_answer)
                .build();
    }

    public QuestionDto mapToDto (QuestionEntity questionEntity){

        var answers = Arrays.asList(PossibleAnswerDto.builder()
                        .id("a")
                        .value(questionEntity.getA_answer())
                        .build(),
                PossibleAnswerDto.builder()
                        .id("b")
                        .value(questionEntity.getB_answer())
                        .build(),
                PossibleAnswerDto.builder()
                        .id("c")
                        .value(questionEntity.getC_answer())
                        .build());

        var question=  QuestionDto.builder()
                .id(String.valueOf(questionEntity.getDatabaseId()))
                .displayId(threadLocalInt.get())
                .value(questionEntity.getQuestionValue())
                .paragraph(questionEntity.getParagraph())
                .goodAnswer(questionEntity.getGoodAnswer())
                .possibleAnswer(answers)
                .build();
        threadLocalInt.set(threadLocalInt.get() + 1);

        return question;
    }

}
