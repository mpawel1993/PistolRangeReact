package pl.pistolrange.pistolrange_server.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDto {
    private String id;
    private String value;
    private String goodAnswer;
    private String paragraph;
    private List<PossibleAnswerDto> possibleAnswer;
}
