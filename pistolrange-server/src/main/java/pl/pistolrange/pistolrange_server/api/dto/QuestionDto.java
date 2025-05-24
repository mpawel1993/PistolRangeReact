package pl.pistolrange.pistolrange_server.api.dto;

import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDto {
    private String id;
    private String displayId;
    private String value;
    private String goodAnswer;
    private String paragraph;
    private List<PossibleAnswerDto> possibleAnswer;
}
