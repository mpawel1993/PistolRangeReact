package pl.pistolrange.pistolrange_server.api.dto;

import lombok.*;
import pl.pistolrange.pistolrange_server.domain.WeaponLawCategory;

import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDto {
    private String id;
    private Integer displayId;
    private String value;
    private String goodAnswer;
    private String paragraph;
    private Integer legacyId;
    private WeaponLawCategory category;
    private List<PossibleAnswerDto> possibleAnswer;
}
